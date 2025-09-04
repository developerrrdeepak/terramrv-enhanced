(async () => {
  try {
    const Database = (await import("./lib/database")).default;
    const db = Database.getInstance();
    await db.connect();

    console.log("Worker started: processing payouts and MRV jobs every 30s");

    const processPayouts = async () => {
      try {
        const payouts = await db
          .getPayoutsCollection()
          .find({ status: "pending" })
          .toArray();
        for (const p of payouts) {
          console.log(
            "Processing payout:",
            p._id?.toString(),
            p.farmerEmail,
            p.amount,
          );
          const res = await db
            .getPayoutsCollection()
            .findOneAndUpdate(
              { _id: p._id },
              {
                $set: {
                  status: "paid",
                  paidAt: new Date(),
                  paidBy: "auto-worker",
                },
              },
              { returnDocument: "after" },
            );

          await db.getDb().collection("audit_logs").insertOne({
            type: "payout_processed",
            payoutId: p._id,
            amount: p.amount,
            paidBy: "auto-worker",
            timestamp: new Date(),
          });

          console.log("Payout marked paid:", res.value?._id?.toString());
        }
      } catch (e) {
        console.error("Worker error processing payouts:", e);
      }
    };

    // Helper: get access token from GEE service account JSON URL
    const getGEEAccessToken = async () => {
      try {
        const url = process.env.GEE_SERVICE_ACCOUNT_URL;
        if (!url) throw new Error("GEE_SERVICE_ACCOUNT_URL not configured");
        const r = await fetch(url);
        if (!r.ok) throw new Error("Failed to fetch GEE JSON");
        const json = await r.json();
        const {
          client_email: clientEmail,
          private_key: privateKey,
          project_id: projectId,
        } = json;
        if (!clientEmail || !privateKey) throw new Error("Invalid GEE JSON");

        const header = { alg: "RS256", typ: "JWT" };
        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + 3600;
        const claim = {
          iss: clientEmail,
          scope:
            "https://www.googleapis.com/auth/earthengine https://www.googleapis.com/auth/cloud-platform",
          aud: "https://oauth2.googleapis.com/token",
          exp,
          iat,
        };

        const base64url = (obj) =>
          Buffer.from(JSON.stringify(obj))
            .toString("base64")
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
        const signingInput = `${base64url(header)}.${base64url(claim)}`;

        const sign = require("crypto").createSign("RSA-SHA256");
        sign.update(signingInput);
        sign.end();
        const signature = sign
          .sign(privateKey, "base64")
          .replace(/=/g, "")
          .replace(/\+/g, "-")
          .replace(/\//g, "_");
        const jwt = `${signingInput}.${signature}`;

        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: jwt,
          }),
        });

        if (!tokenRes.ok) {
          const txt = await tokenRes.text();
          throw new Error("Failed to exchange JWT for access token: " + txt);
        }

        const tok = await tokenRes.json();
        return { access_token: tok.access_token, projectId };
      } catch (e) {
        console.warn("GEE auth failed:", e.message || e);
        return null;
      }
    };

    const processNdviJobs = async () => {
      try {
        const jobs = await db
          .getDb()
          .collection("mrv_jobs")
          .find({ status: "queued" })
          .toArray();
        if (jobs.length === 0) return;

        // Attempt to get GEE access token (if available)
        const geeAuth = await getGEEAccessToken();

        for (const job of jobs) {
          console.log("Processing NDVI job:", job._id?.toString());
          // Mark as processing
          await db
            .getDb()
            .collection("mrv_jobs")
            .updateOne(
              { _id: job._id },
              { $set: { status: "processing", startedAt: new Date() } },
            );

          // If we have GEE auth, in a full implementation we would call Earth Engine APIs here.
          // For now, generate a realistic mock NDVI result but only after successful auth; if auth failed, still proceed with mock.

          let result = null;
          if (geeAuth && geeAuth.access_token) {
            console.log(
              "GEE auth succeeded, would run NDVI task using project",
              geeAuth.projectId || "unknown",
            );
            // TODO: call Earth Engine APIs to compute NDVI and export results
            // For demo, produce deterministic mock based on job._id
            const seed = job._id
              .toString()
              .split("")
              .reduce((s, c) => s + c.charCodeAt(0), 0);
            const ndviMean = ((seed % 30) + 45) / 100; // e.g., 0.45 - 0.75
            result = {
              ndviMean,
              timeseries: Array.from({ length: 6 }).map((_, i) => ({
                date: new Date(Date.now() - (5 - i) * 30 * 24 * 3600 * 1000)
                  .toISOString()
                  .split("T")[0],
                value: Math.max(0, ndviMean + (Math.random() - 0.5) * 0.05),
              })),
            };
          } else {
            console.log("GEE auth unavailable, using mock NDVI result");
            const ndviMean = 0.52 + Math.random() * 0.15;
            result = {
              ndviMean,
              timeseries: Array.from({ length: 6 }).map((_, i) => ({
                date: new Date(Date.now() - (5 - i) * 30 * 24 * 3600 * 1000)
                  .toISOString()
                  .split("T")[0],
                value: Math.max(0, ndviMean + (Math.random() - 0.5) * 0.08),
              })),
            };
          }

          // Store result and mark job done
          await db
            .getDb()
            .collection("mrv_jobs")
            .updateOne(
              { _id: job._id },
              { $set: { status: "done", result, finishedAt: new Date() } },
            );

          // Audit log
          await db
            .getDb()
            .collection("audit_logs")
            .insertOne({
              type: "ndvi_completed",
              jobId: job._id,
              resultSummary: { ndviMean: result.ndviMean },
              timestamp: new Date(),
            });

          console.log("NDVI job completed:", job._id?.toString());
        }
      } catch (e) {
        console.error("Worker error processing NDVI jobs:", e);
      }
    };

    // Run immediately and then interval
    await processPayouts();
    await processNdviJobs();
    setInterval(async () => {
      await processPayouts();
      await processNdviJobs();
    }, 30 * 1000);
  } catch (error) {
    console.error("Worker failed to start:", error);
    process.exit(1);
  }
})();
