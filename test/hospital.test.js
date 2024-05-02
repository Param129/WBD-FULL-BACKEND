const request = require("supertest")

const baseURL = "http://localhost:4000";

describe('POST /hospital/login', () => {
    it('should return 200 OK and a token if login is successful', async () => {
        const response = await request(baseURL)
            .post('/blood/v1/hospital/login')
            .send({ email: 'sample@example.com', password: 'password123' });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it("should return 401 Error and a error if password is wrong", async () => {
        const response = await request(baseURL)
            .post('/blood/v1/hospital/login')
            .send({ email: 'sample@example.com', password: 'test' });


        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Enter correct password");
    })

    it("should return 401 Error and a error if user doesn't exists", async () => {
        const response = await request(baseURL)
            .post('/blood/v1/hospital/login')
            .send({ email: 'testdoes@gmail.com', password: 'test' });

            
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid credential");
    })
});


describe('POST /hospital/signup', () => {

        it('should return 201 OK and Hospital register if successful', async () => {
        const response = await request(baseURL)
            .post('/blood/v1/hospital/signup')
            .send({    name: 'Hospital4 Name',
            licenceNumber: 'M1234567890',
            contactNumber: 1234567887,
            email: 'hospital4@example.com',
            password: 'password1239',
            address: {
                bNo: "123",
                city: "City",
                state: "State",
                country: "India",
                pincode: 123456
            },
            donation:[],
            receiving: []
        });
        
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Hospital signed in succefully ");
    });


    it("should return 409 Error and a error if user already exists", async () => {
        const response = await request(baseURL)
            .post('/blood/v1/hospital/signup')
            .send({ email: 'sample@example.com', password: 'test' });


        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Hospital already exist");
    })
});




describe('POST /hospital/request/search', () => {


    it("should return 200 status and all the hospitals", async () => {
        const response = await request(baseURL)
            .post('/blood/v1/hospital/request/search')
            .send({ city: 'sample city', state: 'sample state' });


        expect(response.status).toBe(200);
        expect(response.body.msg).toBe("hospital fetched successfully");
    })
});



describe('GET /admin/allhospital', () => {


    it("should return 200 status and all the hospitals", async () => {
        const response = await request(baseURL)
            .get('/blood/v1/hospital/admin/allhospital')


        expect(response.status).toBe(404);
        expect(response.body.success).toBe(undefined);
    })
});






