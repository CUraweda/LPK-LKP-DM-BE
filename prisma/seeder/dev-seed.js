import prism from "../../src/config/prisma.db.js";
import { userRole } from "./auth.seeder.js";
import { seedDashboard } from "./dashboard.seeder.js";
import { seedPage } from "./page.seed.js";
import { seedRole } from "./role.seeder.js";
import { seedWhatsapp } from "./whatsapp.seeder.js";
async function main() {
    await seedRole();
    await userRole();
    await seedDashboard()
    await seedPage()
    await seedWhatsapp()
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
