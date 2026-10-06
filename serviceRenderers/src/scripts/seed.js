// Seeds demo providers around Abuja so the map has something to show.
// Usage: npm run seed  (add --reset to wipe existing providers first)
require("../config");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const connectMongo = require("../connection/mongodb.conn");
const renderModel = require("../model/renderer.model");

const DEMO_PASSWORD = "demo1234";

// [name, service, bio, area, lat, lng, rating, ratingCount]
const providers = [
  ["Emeka Okafor", "Plumbing", "Leaks, blocked drains and water heaters. Same-day call-outs.", "Wuse II", 9.0765, 7.4746, 4.8, 37],
  ["Aisha Bello", "Plumbing", "Bathroom fittings and borehole pumps.", "Garki", 9.035, 7.487, 4.5, 12],
  ["Tunde Adeyemi", "Plumbing", "Commercial and residential pipework.", "Gwarinpa", 9.1099, 7.4083, 4.1, 8],
  ["Chidi Nwosu", "Electrician", "Wiring, sockets, inverter and solar installs.", "Maitama", 9.0882, 7.4934, 4.9, 54],
  ["Fatima Yusuf", "Electrician", "Certified for prepaid meter and DB board work.", "Jabi", 9.07, 7.4228, 4.6, 21],
  ["Ibrahim Musa", "Electrician", "Fast fault-finding for homes and shops.", "Kubwa", 9.155, 7.322, 3.9, 6],
  ["Ngozi Eze", "Hair Stylist", "Braids, locs and silk press. Home service available.", "Utako", 9.067, 7.439, 4.9, 88],
  ["Blessing Okon", "Hair Stylist", "Bridal styling and wig installs.", "Wuye", 9.056, 7.454, 4.7, 30],
  ["Segun Afolabi", "Mechanic", "Toyota and Honda specialist. Diagnostics included.", "Central Business District", 9.0541, 7.4892, 4.4, 19],
  ["Usman Danjuma", "Mechanic", "Mobile mechanic, I come to you.", "Lugbe", 8.98, 7.38, 4.2, 11],
  ["Grace Adebayo", "Cleaning", "Deep cleans, move-in/move-out and post-construction.", "Asokoro", 9.0447, 7.5244, 4.8, 42],
  ["Hauwa Sani", "Cleaning", "Weekly home cleaning with eco-friendly products.", "Wuse II", 9.0795, 7.469, 4.6, 25],
  ["Kelechi Obi", "Carpentry", "Custom wardrobes, kitchen cabinets and repairs.", "Durumi", 9.02, 7.47, 4.5, 14],
  ["Yemi Alade", "Tailor", "Native and corporate wear, 5-day turnaround.", "Garki", 9.031, 7.492, 4.7, 33],
  ["Peter Ugwu", "AC Repair", "Servicing, gas refills and installation.", "Jabi", 9.066, 7.43, 4.3, 17],
  ["Amina Lawal", "AC Repair", "Split and standing units, all brands.", "Maitama", 9.092, 7.498, 4.8, 29],
  ["Daniel Etim", "Painter", "Interior, exterior and screeding.", "Gwarinpa", 9.104, 7.415, 4.0, 5],
  ["Musa Abdullahi", "Generator Repair", "Small and industrial generators, servicing plans.", "Utako", 9.072, 7.444, 4.6, 23],
  ["Joy Nnaji", "Makeup Artist", "Events, shoots and lessons.", "Wuse II", 9.081, 7.478, 4.9, 61],
  ["Victor Ade", "Phone Repair", "Screens, batteries and water damage while you wait.", "Central Business District", 9.058, 7.495, 4.4, 40],
];

async function seed() {
  await connectMongo();
  if (process.argv.includes("--reset")) {
    await renderModel.deleteMany({});
    console.log("cleared existing providers");
  }

  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  let created = 0;
  for (const [i, [name, service, bio, area, lat, lng, rating, ratingCount]] of providers.entries()) {
    const phoneNumber = `0800000${String(i + 1).padStart(4, "0")}`;
    const result = await renderModel.updateOne(
      { phoneNumber },
      {
        $setOnInsert: {
          serviceRendererName: name,
          phoneNumber,
          services: service,
          bio,
          password,
          location: { type: "Point", coordinates: [lng, lat], formattedAddress: `${area}, Abuja, Nigeria` },
          rating,
          ratingCount,
        },
      },
      { upsert: true }
    );
    created += result.upsertedCount;
  }

  // Only adds missing indexes; never drops existing ones on a shared database
  await renderModel.createIndexes();
  console.log(`seeded ${created} new providers (${providers.length - created} already existed)`);
  console.log(`demo login: 08000000001 / ${DEMO_PASSWORD}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
