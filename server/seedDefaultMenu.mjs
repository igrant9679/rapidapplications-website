import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function seedDefaultMenu() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection, { schema, mode: "default" });

  console.log("Seeding default header menu...");

  try {
    // Check if header menu already exists
    const existingMenus = await db.select().from(schema.menus).where(eq(schema.menus.location, "header"));
    
    if (existingMenus.length > 0) {
      console.log("Header menu already exists, skipping seed");
      await connection.end();
      return;
    }

    // Create header menu
    const [menuResult] = await db.insert(schema.menus).values({
      name: "Header Navigation",
      location: "header",
      createdAt: new Date(),
    });

    const menuId = Number(menuResult.insertId);
    console.log(`Created header menu with ID: ${menuId}`);

    // Create menu items
    const menuItems = [
      { label: "Solutions", url: "/solutions", order: 1 },
      { label: "Features", url: "/features", order: 2 },
      { label: "Use Cases", url: "/use-cases", order: 3 },
      { label: "About", url: "/about", order: 4 },
      { label: "Partners", url: "/partners", order: 5 },
      { label: "Government", url: "/government-services", order: 6 },
      { label: "Blog", url: "/blog", order: 7 },
    ];

    for (const item of menuItems) {
      await db.insert(schema.menuItems).values({
        menuId,
        label: item.label,
        url: item.url,
        type: "custom",
        order: item.order,
        createdAt: new Date(),
      });
      console.log(`Created menu item: ${item.label}`);
    }

    console.log("Default header menu seeded successfully!");
  } catch (error) {
    console.error("Error seeding default menu:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedDefaultMenu().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
