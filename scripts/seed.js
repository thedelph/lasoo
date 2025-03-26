import { seedDatabase } from '../lib/db';

const locksmiths = [
  {
    companyName: "Quick Lock",
    telephoneNumber: "0123456789",
    website: "https://quicklock.com",
    servicesOffered: ["home", "car"],
    latitude: 51.5074,
    longitude: -0.1278,
    serviceRadius: 10 // Serves central London, 10km radius
  },
  {
    companyName: "Safe & Sound",
    telephoneNumber: "9876543210",
    website: "https://safeandsound.com",
    servicesOffered: ["home"],
    latitude: 51.5114,
    longitude: -0.1368,
    serviceRadius: 15 // Larger coverage area, 15km radius
  },
  {
    companyName: "Auto Unlock",
    telephoneNumber: "5555555555",
    website: "https://autounlock.com",
    servicesOffered: ["car"],
    latitude: 51.5034,
    longitude: -0.1188,
    serviceRadius: 25 // Mobile service, covers greater London, 25km radius
  },
  {
    companyName: "Master Key",
    telephoneNumber: "1111111111",
    website: "https://masterkey.com",
    servicesOffered: ["home", "car"],
    latitude: 51.5054,
    longitude: -0.1258,
    serviceRadius: 5 // Local specialist, small service area, 5km radius
  },
];

seedDatabase(locksmiths)
  .then(() => console.log('Database has been seeded with sample locksmith data'))
  .catch(console.error);