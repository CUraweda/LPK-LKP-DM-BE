import prism from "../../src/config/prisma.db.js";
import { seedRole } from "./role.seeder.js";

async function main() {
    await seedRole();
}

main()
  .then(() => {
    console.log('Seeding completed!');
  })
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prism.$disconnect();
  });
