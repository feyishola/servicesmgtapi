import { faker } from "@faker-js/faker";

export const makeData = (numberOfRows) =>
  [...Array(numberOfRows).fill(null)].map(() => ({
    firstName: faker.person.firstName(),
    middleName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    userType: faker.helpers.arrayElement([
      "admin",
      "support",
      "reviewer",
      "qa",
    ]),
    status: faker.helpers.arrayElement([
      "active",
      "active",
      "active",
      "active",
      "inactive",
      "suspended",
      "blocked",
    ]),
    phoneNumber: faker.phone.number().normalize(),
    address: faker.location.streetAddress(),
    avarta: faker.internet.avatar(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    petName: faker.animal.cat(),
    age: faker.datatype.float({ min: 0, max: 100 }),
    salary: faker.datatype
      .float({ min: 0, max: 1000000 })
      .toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
    dateOfBirth: faker.date.past().toDateString(),
    dateOfJoining: faker.date.past().toDateString(),
    isActive: faker.datatype.boolean() ? "Active" : "Inactive",
  }));
