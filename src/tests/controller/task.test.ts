import request from 'supertest';
import app from '../../app';
import { validationResult, body, param } from 'express-validator';
import { insertTask, fetchTasks, getTasksByUsername, getTasksByCategory } from '../../utils/task';


jest.mock('../../utils/task', () => ({
    insertTask: jest.fn(),
    fetchTasks: jest.fn(),
    getTasksByUsername: jest.fn(),
    getTasksByCategory: jest.fn(),
}));

// jest.mock('express-validator');
jest.mock('express-validator', () => ({
    param: jest.fn(),
    body: jest.fn(),
    validationResult: jest.fn(),
}));


// import { validationResult } from 'express-validator';
// const mockFn = jest.fn();

// jest.mock('express-validator', () => ({
//     validationResult: jest.fn()
//   }));
const reqBody: any = {
    // title: "CI/CD Pipeline",
    // description: "Develop and deploy properly oriented CI/CD pipeline.",
    creation_date: "03/03/2022", 
    due_date: "04/05/2022", 
    assigned_to: "Usama", 
    category: "DevOps",
    status: "Pending"
}


describe('getAllTasks', () => {
    it('should return valid input and success response', async() => {
        (fetchTasks as jest.Mock).mockReturnValue([]);
        const response = await request(app).get("/api/v1/tasks");

        expect(response.body.msg).toEqual('Successfully fetched all tasks.');
        expect(response.body.data).toEqual([]);
        expect(response.status).toBe(200);
    });

    it('should return tasks and sucess response', async() => {
        await request(app).post("/api/v1/task").send(reqBody); //assert task.

        reqBody.id = 1;
        (fetchTasks as jest.Mock).mockReturnValue([reqBody]);
        
        const response = await request(app).get("/api/v1/tasks");
        
        expect(response.body.msg).toEqual('Successfully fetched all tasks.');
        expect(response.body.data[0]).toEqual(reqBody);
        expect(response.status).toBe(200);
        });

    it('should return error if fail to get tasks', async() => {
        (fetchTasks as jest.Mock).mockReturnValue(null);

        const response = await request(app).get("/api/v1/tasks");
        
        expect(response.body.msg).toEqual('Something went wrong');
        expect(response.status).toBe(500);
    })

    it('should return tasks by user and response success if right query params is passed', async() => {
        reqBody.id = 1;
        (getTasksByUsername as jest.Mock).mockReturnValue([reqBody]);

        const response = await request(app).get(`/api/v1/tasks?assignedTo=${reqBody.assigned_to}`);
        
        expect(response.body.msg).toEqual('Successfully fetched all tasks.');
        expect(response.body.data[0]).toEqual(reqBody);
        expect(response.status).toBe(200);
    });

    it('should return empty array if assigned user\'s task is not found', async() => {
        (getTasksByUsername as jest.Mock).mockReturnValue([]);

        const response = await request(app).get("/api/v1/tasks?assignedTo=ali");
        
        expect(response.body.msg).toEqual('Successfully fetched all tasks.');
        expect(response.body.data).toEqual([]);
        expect(response.status).toBe(200);
    })

    it('should return task by category and if right category is passed', async() => {
        reqBody.id = 1;
        (getTasksByCategory as jest.Mock).mockReturnValue([reqBody]);

        const response = await request(app).get(`/api/v1/tasks?category=${reqBody.category}`);
        
        expect(response.body.msg).toEqual('Successfully fetched all tasks.');
        expect(response.body.data[0]).toEqual(reqBody);
        expect(response.status).toBe(200);
    });

    it('should return empty array if there\'s no task with that category', async() => {
        (getTasksByCategory as jest.Mock).mockReturnValue([]);

        const response = await request(app).get(`/api/v1/tasks?category=ui`);
        
        expect(response.body.msg).toEqual('Successfully fetched all tasks.');
        expect(response.body.data).toEqual([]);
        expect(response.status).toBe(200);
    })
    
    
});

describe('createTask', () => {
    test('1', async() => {
        const req = {
            body: reqBody,
            params: { }
        };

        console.log('req', req);
        (body as jest.Mock).mockReturnValueOnce(req)
        (param as jest.Mock).mockReturnValue(req)
        (validationResult as any).mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'Invalid input' }],
          });

        (insertTask as jest.Mock).mockReturnValueOnce(reqBody);

        const response = await request(app).post("/api/v1/task").send(reqBody);

        expect(validationResult).toHaveBeenCalledWith(req);

        expect(response.body).toMatchInlineSnapshot();
    }) 
})