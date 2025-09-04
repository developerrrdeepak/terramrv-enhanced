(async () => {
  try {
    const { MongoClient } = await import('mongodb');
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI not set');
      process.exit(1);
    }

    const client = new MongoClient(uri);
    await client.connect();
    const dbName = process.env.DB_NAME || 'carbonroots';
    const db = client.db(dbName);

    // Ensure demo farmers
    const farmersCol = db.collection('farmers');
    const existing = await farmersCol.findOne({ email: 'rajesh@example.com' });
    if (!existing) {
      await farmersCol.insertMany([
        {
          email: 'rajesh@example.com',
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          location: { state: 'Punjab' },
          landSize: 5.2,
          carbonCredits: 12.5,
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'priya@example.com',
          name: 'Priya Sharma',
          phone: '+91 87654 32109',
          location: { state: 'Haryana' },
          landSize: 3.8,
          carbonCredits: 0,
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'amit@example.com',
          name: 'Amit Singh',
          phone: '+91 76543 21098',
          location: { state: 'Uttar Pradesh' },
          landSize: 7.1,
          carbonCredits: 18.7,
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      console.log('Inserted demo farmers');
    } else {
      console.log('Demo farmers already exist');
    }

    // Ensure demo projects
    const projectsCol = db.collection('projects');
    const existingProject = await projectsCol.findOne({ name: 'Agroforestry Initiative' });
    if (!existingProject) {
      await projectsCol.insertMany([
        {
          name: 'Agroforestry Initiative',
          type: 'agroforestry',
          participants: 45,
          totalCredits: 567.8,
          status: 'active',
          createdDate: new Date(),
        },
        {
          name: 'Rice Carbon Project',
          type: 'rice_based',
          participants: 23,
          totalCredits: 234.5,
          status: 'active',
          createdDate: new Date(),
        },
      ]);
      console.log('Inserted demo projects');
    } else {
      console.log('Demo projects already exist');
    }

    // Ensure demo credits
    const creditsCol = db.collection('credits');
    const creditCount = await creditsCol.countDocuments();
    if (creditCount === 0) {
      await creditsCol.insertMany([
        {
          farmerId: null,
          farmerEmail: 'rajesh@example.com',
          farmerName: 'Rajesh Kumar',
          project: 'Agroforestry Initiative',
          amount: 25.5,
          status: 'pending',
          requestedAt: new Date(),
        },
        {
          farmerId: null,
          farmerEmail: 'amit@example.com',
          farmerName: 'Amit Singh',
          project: 'Rice Carbon Project',
          amount: 18.7,
          status: 'pending',
          requestedAt: new Date(),
        },
      ]);
      console.log('Inserted demo credits');
    } else {
      console.log('Demo credits already present');
    }

    // Ensure demo payouts
    const payoutsCol = db.collection('payouts');
    const payoutCount = await payoutsCol.countDocuments();
    if (payoutCount === 0) {
      await payoutsCol.insertOne({
        farmerEmail: 'rajesh@example.com',
        farmerName: 'Rajesh Kumar',
        amount: 5000,
        status: 'pending',
        createdAt: new Date(),
      });
      console.log('Inserted demo payouts');
    } else {
      console.log('Demo payouts already present');
    }

    // Audit log collection
    const auditCol = db.collection('audit_logs');
    await auditCol.insertOne({ message: 'Seed run', createdAt: new Date() });

    await client.close();
    console.log('Seeding complete');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
})();
