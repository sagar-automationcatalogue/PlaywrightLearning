import {thinkingBaseURL} from '../config/EnvironmentConfig';
import { APIRequestContext, expect } from '@playwright/test';
import { ThinkingTesterUserBuilder } from '../builders/Thinking-tester-UserBuilder';
import { URLConfig } from '../config/URLConfig';

export class Contacts{
    private readonly baseUrl = thinkingBaseURL;
    private readonly request: APIRequestContext;
    
    constructor(request: APIRequestContext){
        this.request = request;
    }

    async createUser(body: ReturnType<typeof ThinkingTesterUserBuilder.createUser>) {
        return await this.request.post(
            this.baseUrl+URLConfig.API.ThinkingTester.createUser, 
            {
                headers: this.getHeaders(),
                data: body
            }
        );
    }

    /*async verifyRegisterResponse(responseBody: unknown) {
        expect(responseBody).toEqual(expect.objectContaining({
            first_name: expect.any(String),
            last_name: expect.any(String),
            address: expect.objectContaining({
                street: expect.any(String),
                house_number: '123',
                city: 'Hyderabad',
                state: expect.any(String),
                country: expect.any(String),
                postal_code: expect.any(String)
            }),
            phone: expect.any(String),
            dob: expect.any(String),
            password: expect.any(String),
            email: expect.any(String)
        }));
    }*/

    private getHeaders() {
        return {
            'Content-Type':`application/json`,
            Accept:`application/json`
        };
    }
       
}