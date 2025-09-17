import swaggerJSDoc from "swagger-jsdoc";

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Fitness Tracker API",
    version: "1.0.0",
    description: "CRUD of Users and Workouts with validation and error handling.",
  },
  servers: [
    { url: "http://localhost:3000", description: "Local" },
    { url: "https://cse341-adylansd-project1.onrender.com", description: "Render" }
  ],
  tags: [{ name: "Users" }, { name: "Workouts" }],
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: {
          message: { type: "string" },
          details: { type: "array", items: { type: "string" } }
        }
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "665c0d7f2b39f0d6b0a0b111" },
          name: { type: "string", example: "Alice Johnson" },
          email: { type: "string", example: "alice@test.com" },
          age: { type: "integer", example: 25 },
          gender: { type: "string", enum: ["male","female","other"], example: "female" },
          heightCm: { type: "number", example: 165 },
          weightKg: { type: "number", example: 60 },
          goal: { type: "string", enum: ["lose_weight","maintenance","gain_muscle"], example: "maintenance" },
          activityLevel: { type: "string", enum: ["low","medium","high"], example: "medium" },
          createdAt: { type: "string", format: "date-time", example: "2025-09-17T12:00:00.000Z" }
        },
        required: ["name","email","age","gender","heightCm","weightKg","goal","activityLevel"]
      },
      Workout: {
        type: "object",
        properties: {
          _id: { type: "string", example: "665c0d7f2b39f0d6b0a0b222" },
          userId: { type: "string", example: "665c0d7f2b39f0d6b0a0b111" },
          date: { type: "string", format: "date-time", example: "2025-09-18T18:30:00.000Z" },
          type: { type: "string", enum: ["run","cycle","strength","other"], example: "run" },
          durationMin: { type: "number", example: 30 },
          calories: { type: "number", example: 300 },
          distanceKm: { type: "number", example: 5 },
          notes: { type: "string", example: "Morning jog" }
        },
        required: ["userId","date","type","durationMin","calories"]
      }
    },
    parameters: {
      IdParam: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string", example: "665c0d7f2b39f0d6b0a0b111" }
      }
    }
  },
  paths: {
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      post: {
        tags: ["Users"],
        summary: "Create user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } }
        },
        responses: {
          201: { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          400: { description: "Invalid id", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      put: {
        tags: ["Users"],
        summary: "Update user",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          400: { description: "Invalid id / validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          204: { description: "Deleted" },
          400: { description: "Invalid id", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },

    "/api/workouts": {
      get: {
        tags: ["Workouts"],
        summary: "List workouts (filters: userId, from, to)",
        parameters: [
          { name: "userId", in: "query", schema: { type: "string" } },
          { name: "from", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "to", in: "query", schema: { type: "string", format: "date-time" } }
        ],
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Workout" } } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      post: {
        tags: ["Workouts"],
        summary: "Create workout",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Workout" } } } },
        responses: {
          201: { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Workout" } } } },
          400: { description: "Validation error / userId not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },
    "/api/workouts/{id}": {
      get: {
        tags: ["Workouts"],
        summary: "Get workout by id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Workout" } } } },
          400: { description: "Invalid id", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      put: {
        tags: ["Workouts"],
        summary: "Update workout",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Workout" } } } },
        responses: {
          200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Workout" } } } },
          400: { description: "Invalid id / validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      },
      delete: {
        tags: ["Workouts"],
        summary: "Delete workout",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          204: { description: "Deleted" },
          400: { description: "Invalid id", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    }
  }
};

export default swaggerJSDoc({ definition: swaggerSpec, apis: [] });
