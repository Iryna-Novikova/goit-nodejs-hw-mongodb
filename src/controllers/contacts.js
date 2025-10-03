import {
  getAllContacts,
  getContactById,
  postContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

//пошук за ID контакту
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  //якщо контакт не знайдено
  if (contact === null) {
    throw createHttpError(404, `Contact with ID: ${contactId} not found.`);
  }

  //якщо контакт знайдено
  res.json({
    status: 200,
    message: `Successfully found contact with ID ${contactId}!`,
    data: contact,
  });
};

export const postContactController = async (req, res, next) => {
  const contact = await postContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

//видалення об'єкту
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  //якщо контакт не знайдено
  if (contact === null) {
    throw createHttpError(404, `Contact with ID: ${contactId} not found.`);
  }

  //якщо контакт знайдено
  res.status(204).send();
};

//Часткове оновлення контакту
export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await updateContact(contactId, req.body);

  if (contact === null) {
    throw createHttpError(404, `Contact with ID: ${contactId} not found.`);
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};
