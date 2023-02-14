// By default jest does not work with the new import syntax
// We should add NODE_OPTIONS=--experimental-vm-modules to the test script in package.json to enable the usage of import syntax
// On Windows you cannot use NODE_OPTIONS (and all env vars) from command line --> YOU HAVE TO USE CROSS-ENV PACKAGE TO BE ABLE TO PASS
// ENV VARS TO COMMAND LINE SCRIPTS ON ALL OPERATIVE SYSTEMS!!!

import supertest from "supertest"
import dotenv from "dotenv"
import mongoose from "mongoose"
import server from "../src/server.js"
import ProductsModel from "../src/api/products/model.js"

dotenv.config() // This command forces .env vars to be loaded into process.env. This is the way to do it whenever you can't use -r dotenv/config

// supertest is capable of executing server.listen of our Express app if we pass the Express server to it
// It will give us back a client that can be used to run http requests on that server

const client = supertest(server)

 describe("Test APIs", () => {
  it("Should test that GET /test endpoint returns 200 and a body containing a message", async () => {
    const response = await client.get("/products")
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true);
  })
})
 


beforeAll(async () => {
   mongoose.connect(process.env.MONGO_URL_TEST)
  const product = new ProductsModel({ name: "test", description: "blalblabla", price: 20 })
  await product.save()
});


// beforeAll is a Jest hook ran before all the tests, usually it is used to connect to the db and to do some initial setup (like inserting some mock data in the db)

afterAll(async () => {
  await ProductsModel.deleteMany()
  await mongoose.connection.close()
})
// afterAll hook could be used to clean up the situation (close the connection to Mongo gently and clean up db/collections)

it("GET /products should return a success status code and a body", async () => {
  const response = await client.get("/products").expect(200)
  expect(response.body).toBeDefined()
  })
  
  it("POST /products should return a valid _id and 201 in case of a valid product, 400 if not", async () => {
  const validProduct = {
  name: "Test Product",
  description: "A test product",
  price: 100,
  }
  const invalidProduct = {
    name: "Test Product",
    price: 100,
  }
  
  const response1 = await client.post("/products").send(validProduct).expect(201)
  const response2 = await client.post("/products").send(invalidProduct).expect(400)
  
  expect(response1.body._id).toBeDefined()  

  })

//   it("GET /products/:id should return the correct product with a valid id and 404 with a non-existing id", async () => {
//     const validProduct = {
//     name: "Test Product",
//     description: "A test product",
//     price: 100,
//     }
//     const product = await new ProductModel(validProduct).save()
// const productId = product._id

// const response1 = await client.get(`/products/${productId}`).expect(200)
// expect(response1.body._id).toEqual(productId.toString())

// const response2 = await client.get("/products/63eba6f9542f7f50e09395db").expect(404)
// })


// it("DELETE /products/:id should return 204 with a valid id and 404 with a non-existing id", async () => {
//   const validProduct = {
//   name: "Test Product",
//   description: "A test product",
//   price: 100,
//   }
//   const product = await new ProductModel(validProduct).save()
// const productId = product._id

// const response1 = await client.delete(`/products/${productId}`).expect(204)
// const response2 = await client.delete("/products/63eba6f9542f7f50e09395db").expect(404)
// })

// it("PUT /products/:id should update a product with valid data and return 404 with a non-existing id", async () => {
//   const validProduct = {
//   name: "Test Product",
//   description: "A test product",
//   price: 100,
//   }
//   const product = await new ProductModel(validProduct).save()
// const productId = product._id

// const updatedProduct = {
//   name: "Updated Product",
//   description: "An updated test product",
//   price: 200,
// }

// const response1 = await client.put(`/products/${productId}`).send(updatedProduct).expect(200)

// expect(response1.body.name).toBe(updatedProduct.name)
// expect(typeof response1.body.name).toBe("string")

// const response2 = await client.put("/products/63eba6f9542f7f50e09395db").send(updatedProduct).expect(404)
// })


test('Jest can use import syntax with NODE_OPTIONS', () => {
  // Ensure the NODE_OPTIONS environment variable is set to enable import syntax
  expect(process.env.NODE_OPTIONS).toContain('--experimental-vm-modules');
});




describe('API Endpoints', () => {
  it('GET /test endpoint should return 200 and a message', async () => {
    const response = await client.get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /products endpoint should return 200 and a body', async () => {
    const response = await client.get('/products');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('POST /products with a valid product should return 201 and a valid _id', async () => {
    const validProduct = {
      name: 'Test Product',
      description: 'A test product',
      price: 100,
    };
    const response = await client.post('/products').send(validProduct);
    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
  });
});
