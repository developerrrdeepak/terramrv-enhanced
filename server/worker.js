(async () => {
  try {
    const Database = (await import('./lib/database')).default;
    const db = Database.getInstance();
    await db.connect();

    console.log('Worker started: processing payouts every 30s');

    const processPayouts = async () => {
      try {
        const payouts = await db.getPayoutsCollection().find({ status: 'pending' }).toArray();
        for (const p of payouts) {
          console.log('Processing payout:', p._id?.toString(), p.farmerEmail, p.amount);
          // Demo flow: mark as paid after processing
          const res = await db.getPayoutsCollection().findOneAndUpdate(
            { _id: p._id },
            { $set: { status: 'paid', paidAt: new Date(), paidBy: 'auto-worker' } },
            { returnDocument: 'after' },
          );

          // Write audit log
          await db.getDb().collection('audit_logs').insertOne({
            type: 'payout_processed',
            payoutId: p._id,
            amount: p.amount,
            paidBy: 'auto-worker',
            timestamp: new Date(),
          });

          console.log('Payout marked paid:', res.value?._id?.toString());
        }
      } catch (e) {
        console.error('Worker error processing payouts:', e);
      }
    };

    // Run immediately and then interval
    await processPayouts();
    setInterval(processPayouts, 30 * 1000);
  } catch (error) {
    console.error('Worker failed to start:', error);
    process.exit(1);
  }
})();
