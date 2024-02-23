import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.join(__dirname, "../db/contacts.json");

// ===============================================================>
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");

    return JSON.parse(data);
  } catch (error) {
    console.log("Error reading contacts ", error.message);
    throw error;
  }
}
// ===============================================================>
async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts.find((contact) => contact.id === contactId) || null;
  } catch (error) {
    console.log("Error reading contacts ", error.message);
    throw error;
  }
}
// ===============================================================>
async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const removeContact = contacts.find((contact) => contact.id === contactId);

    if (!removeContact) return null;

    const updatedContacts = contacts.filter((contact) => contact.id !== contactId);

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2), "utf-8");
    return removeContact;
  } catch (error) {
    console.log("Error reading contacts ", error.message);
    throw error;
  }
}
// ===============================================================>
async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);

    const existingContact = contacts.find(
      (contact) => contact.email === email || contact.phone === phone
    );
    const newContact = { id: crypto.randomUUID(), name, email, phone };
    const updatedContacts = [...contacts, newContact];
    if (existingContact) {
      return null;
    }

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2), "utf-8");

    return newContact;
  } catch (error) {
    console.log("Error reading contacts ", error.message);
    throw error;
  }
}
// ===============================================================>
async function updateToContact(id, body) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);

    const index = contacts.findIndex((contact) => contact.id === id);

    if (index === -1) {
      return null;
    }
    contacts[index] = { ...contacts[index], ...body };

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");
    return contacts[index];
  } catch (error) {
    console.log("Error updating contact ", error.message);
    throw error;
  }
}
// ===============================================================>

export { listContacts, getContactById, removeContact, addContact, updateToContact };
