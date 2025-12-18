import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My API",
    description: "API Documentation for My Application",
  },
  host: "localhost:5000",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      scheme: "bearer",
      in: "header",
      description:
        'Enter the token with the `Bearer ` prefix, e.g., "Bearer YOUR_TOKEN"',
    },
  },
  security: [{ bearerAuth: [] }],
  definitions: {
    User: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.mjs"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated!");
});