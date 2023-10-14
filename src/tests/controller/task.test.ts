import request from "supertest";
import app from "../../app";
1;
import {
  insertTask,
  fetchTasks,
  getTasksByUsername,
  getTasksByCategory,
  fetchTaskById,
  removeTask,
  modifyTask,
} from "../../utils/task";
import taskFakeData from "../shared/constant/fakeTasks";

jest.mock("../../utils/task", () => ({
  insertTask: jest.fn(),
  fetchTasks: jest.fn(),
  getTasksByUsername: jest.fn(),
  getTasksByCategory: jest.fn(),
  fetchTaskById: jest.fn(),
  removeTask: jest.fn(),
  modifyTask: jest.fn(),
}));

describe("getAllTasks", () => {
  it("should return valid input and success response", async () => {
    (fetchTasks as jest.Mock).mockReturnValue([]);
    const response = await request(app).get("/api/v1/tasks");

    expect(response.body.msg).toEqual("Successfully fetched all tasks.");
    expect(response.body.data).toEqual([]);
    expect(response.status).toBe(200);
  });

  it("should return tasks and sucess response", async () => {
    await request(app).post("/api/v1/task").send(taskFakeData); //assert task.

    taskFakeData.id = 1;
    (fetchTasks as jest.Mock).mockReturnValue([taskFakeData]);

    const response = await request(app).get("/api/v1/tasks");

    expect(response.body.msg).toEqual("Successfully fetched all tasks.");
    expect(response.body.data[0]).toEqual(taskFakeData);
    expect(response.status).toBe(200);
  });

  it("should return error if fail to get tasks", async () => {
    (fetchTasks as jest.Mock).mockReturnValue(null);

    const response = await request(app).get("/api/v1/tasks");

    expect(response.body.msg).toEqual("Something went wrong");
    expect(response.status).toBe(500);
  });

  it("should return tasks by user and response success if right query params is passed", async () => {
    taskFakeData.id = 1;
    (getTasksByUsername as jest.Mock).mockReturnValue([taskFakeData]);

    const response = await request(app).get(
      `/api/v1/tasks?assignedTo=${taskFakeData.assigned_to}`
    );

    expect(response.body.msg).toEqual("Successfully fetched all tasks.");
    expect(response.body.data[0]).toEqual(taskFakeData);
    expect(response.status).toBe(200);
  });

  it("should return empty array if assigned user's task is not found", async () => {
    (getTasksByUsername as jest.Mock).mockReturnValue([]);

    const response = await request(app).get("/api/v1/tasks?assignedTo=ali");

    expect(response.body.msg).toEqual("Successfully fetched all tasks.");
    expect(response.body.data).toEqual([]);
    expect(response.status).toBe(200);
  });

  it("should return task by category and if right category is passed", async () => {
    taskFakeData.id = 1;
    (getTasksByCategory as jest.Mock).mockReturnValue([taskFakeData]);

    const response = await request(app).get(
      `/api/v1/tasks?category=${taskFakeData.category}`
    );

    expect(response.body.msg).toEqual("Successfully fetched all tasks.");
    expect(response.body.data[0]).toEqual(taskFakeData);
    expect(response.status).toBe(200);
  });

  it("should return empty array if there's no task with that category", async () => {
    (getTasksByCategory as jest.Mock).mockReturnValue([]);

    const response = await request(app).get(`/api/v1/tasks?category=ui`);

    expect(response.body.msg).toEqual("Successfully fetched all tasks.");
    expect(response.body.data).toEqual([]);
    expect(response.status).toBe(200);
  });
});

describe("createTask", () => {
  test("should return success if correct body is passed to insertTask", async () => {
    const req = {
      body: taskFakeData,
    };

    (insertTask as jest.Mock).mockReturnValueOnce(true);

    const response = await request(app).post("/api/v1/task").send(req.body);

    expect(response.status).toBe(200);
    expect(response.body.msg).toEqual("Task created successfully");
  });

  test("should return error if insertTask return some incorrect response", async () => {
    const req = {
      body: taskFakeData,
    };

    (insertTask as jest.Mock).mockReturnValueOnce(null);

    const response = await request(app).post("/api/v1/task").send(req.body);

    expect(response.status).toBe(500);
    expect(response.body.msg).toEqual("Something went wrong");
  });

  test("should return internal server error if insertTask return false.", async () => {
    const req = {
      body: taskFakeData,
    };

    (insertTask as jest.Mock).mockReturnValueOnce(false);

    const response = await request(app).post("/api/v1/task").send(req.body);

    expect(response.status).toBe(500);
    expect(response.body.msg).toEqual("Something went wrong");
  });

  test("should return invalid input if validationResult return false", async () => {
    const requestBody = {
      title: "fakeTitle",
    };
    const req = {
      body: requestBody,
    };

    (insertTask as jest.Mock).mockReturnValueOnce(true);

    const response = await request(app).post("/api/v1/task").send(req.body);

    expect(response.status).toBe(400);
    expect(response.body.msg).toEqual("Invalid Input Data");
  });

});

describe("getTaskById", () => {
  test("should return error if params is not a integer.", async () => {
    const req = {
      body: taskFakeData,
      params: { id: "abc" },
    };

    const response = await request(app).get(`/api/v1/task/${req.params.id}`);

    expect(response.status).toBe(400);
    expect(response.body.msg).toEqual("Invalid Input Data");
  });

  test("should return task if correct id passed.", async () => {
    const req = {
      body: taskFakeData,
      params: { id: 1 },
    };

    (fetchTaskById as jest.Mock).mockReturnValueOnce([taskFakeData]);

    await request(app).post("/api/v1/task").send(taskFakeData); //Asserting just to check response.

    const response = await request(app).get(`/api/v1/task/${req.params.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data[0]).toEqual(taskFakeData);
  });

  test("should return task if invalid id passed.", async () => {
    const req = {
      body: taskFakeData,
      params: { id: 9 },
    };

    (fetchTaskById as jest.Mock).mockReturnValueOnce([]);

    await request(app).post("/api/v1/task").send(taskFakeData); //Asserting just to check response.

    const response = await request(app).get(`/api/v1/task/${req.params.id}`);

    expect(response.status).toBe(404);
    expect(response.body.data).toEqual([]);
  });

  test("should return internal server error if task is not fetch properly", async () => {
    const req = {
      body: taskFakeData,
      params: { id: 12 },
    };

    (fetchTaskById as jest.Mock).mockReturnValueOnce(null);

    await request(app).post("/api/v1/task").send(taskFakeData); //Asserting just to check response.

    const response = await request(app).get(`/api/v1/task/${req.params.id}`);

    expect(response.status).toBe(500);
    expect(response.body.msg).toEqual("Something went wrong");
  });
});

describe("deleteTask", () => {
  test("should return error if validation failed.", async () => {
    const req = {
      body: {},
      params: { id: "abc" },
    };

    const response = await request(app).delete(`/api/v1/task/${req.params.id}`);

    expect(response.status).toBe(400);
    expect(response.body.msg).toEqual("Invalid Input Data");
  });

  test("should delete task.", async () => {
    const req = {
      body: taskFakeData,
      params: { id: 1 },
    };

    (removeTask as jest.Mock).mockReturnValueOnce(true);

    await request(app).post("/api/v1/task").send(req.body); //Asserting just to check response.

    const response = await request(app).delete(`/api/v1/task/${req.params.id}`);

    expect(response.status).toBe(200);
    expect(response.body.msg).toEqual(
      "Requested Task is deleted successfully."
    );
  });

  test("should return 404 if task against id not found", async () => {
    const req = {
      body: taskFakeData,
      params: { id: 2 },
    };

    (removeTask as jest.Mock).mockReturnValueOnce(false);

    await request(app).post("/api/v1/task").send(req.body); //Asserting just to check response.

    const response = await request(app).delete(`/api/v1/task/${req.params.id}`);

    expect(response.status).toBe(404);
    expect(response.body.msg).toEqual(
      "Requested Task is not present in the table."
    );
  });
});

describe("updateTask", () => {
  beforeEach(() => {
    (modifyTask as jest.Mock).mockReset();
  });
  test("should return error if validation failed.", async () => {
    const response = await request(app).put(`/api/v1/task/abc`);

    expect(response.status).toBe(400);
    expect(response.body.msg).toEqual("Invalid Input Data");
  });

  test("should return success response if task updated successfully.", async () => {
    const req = {
      body: taskFakeData,
      params: { id: 2 },
    };

    req.body.assigned_to = "Jousha";

    (modifyTask as jest.Mock).mockReturnValueOnce(true);

    await request(app).post("/api/v1/task").send(req.body); //Asserting just to check response.

    const response = await request(app)
      .put(`/api/v1/task/${req.params.id}`)
      .send(req.body);

    expect(response.status).toBe(200);
    expect(response.body.msg).toEqual("Task updated successfully");
  });

  test("should return internal server error if task not updated.", async () => {
    const req = {
      body: taskFakeData,
      params: { id: 1 },
    };

    req.body.category = "UI";

    (modifyTask as jest.Mock).mockReturnValueOnce(false);

    await request(app).post("/api/v1/task").send(req.body); //Asserting just to check response.

    const response = await request(app)
      .put(`/api/v1/task/${req.params.id}`)
      .send(req.body);

    expect(response.status).toBe(500);
    expect(response.body.msg).toEqual("Task does not updated successfully");
  });
});
