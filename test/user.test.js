const request = require("supertest")

const baseURL = "http://localhost:4000";

describe('POST /login', () => {
    it('should return 200 OK and a token if login is successful', async () => {
        const response = await request(baseURL)
            .post('/blood/v1/login')
            .send({ email: 'u1@gmail.com', password: 'user1' });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it("should return 433 Error and a error if password is wrong", async () => {
        const response = await request(baseURL)
            .post('/blood/v1/login')
            .send({ email: 'u1@gmail.com', password: 'test' });


        expect(response.status).toBe(400);
        expect(response.body.msg).toBe("Invalid Password");
    })

    it("should return 403 Error and a error if user doesn't exists", async () => {
        const response = await request(baseURL)
            .post('/blood/v1/login')
            .send({ email: 'testdoes@gmail.com', password: 'test' });

            
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe("Invalid email or password");
    })
});


describe('POST /register', () => {
    // it('should return 200 OK and userId if successful', async () => {
    //     const response = await request(baseURL)
    //         .post('/blood/v1/register')
    //         .send({name:"user100", email: 'u100@gmail.com', password: 'user100',age:20,phone:1002986745,bloodgrp:"B+",gender:"male",address:"sri city", avatar:"vgybh"});
        
    //     expect(response.status).toBe(201);
    //     expect(response.body).toHaveProperty('User');
    //     expect(response.body.status).toBe("True");
    // });

    it("should return 433 Error and a error if user already exists", async () => {
        const response = await request(baseURL)
            .post('/blood/v1/register')
            .send({ email: 'u1@gmail.com', password: 'test' });


        expect(response.status).toBe(400);
        expect(response.body.msg).toBe("User already registered.");
    })
});



describe('GET /me', () => {


    it("should return user details if user found", async () => {
        const response = await request(baseURL)
            .post('/blood/v1/me')


        expect(response.status).toBe(404);
    })
});