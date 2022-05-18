const request = require('supertest');
const server = require ('./server.js');

describe("POST /api/users", () => {

    describe("given a username and password", () => {
        // should save the username and password to the database
        // should respond with a json object contain an access token and a refresh token
        test("should respond with status 200", () => {
            const response = request(server).post("/api/users").send({
                email: "username@gmail.com",
                password: "password123#$" 
            })
            expect(response.statusCode).toBe(200);
        });
        // should specify json in the content header
    });

    describe("when the username and password is missing", () => {

    });
});