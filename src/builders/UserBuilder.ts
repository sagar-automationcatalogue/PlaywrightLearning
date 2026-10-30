export class UserBuilder {
    private static readonly firstNames = ['Aarav', 'Aisha', 'Daniel', 'Emma', 'Liam', 'Sophia'];
    private static readonly lastNames = ['Anderson', 'Brown', 'Clark', 'Davis', 'Miller', 'Wilson'];

    static createRandomFirstName() {
        return this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    }

    static createRandomLastName() {
        return this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    }

    static createRandomEmail() {
        const randomNumber = Date.now();
        const randomEmail = `user_${randomNumber}@gmail.com`;

        return randomEmail;
    }

    static registerUser() {
        const firstName = this.createRandomFirstName();
        const lastName = this.createRandomLastName();
        const randomEmail = this.createRandomEmail();

        return {
            first_name: `${firstName}_test`,
            last_name: lastName.toLowerCase(),
            address: {
                street: 'KPHB board',
                house_number: '123',
                city: 'Hyderabad',
                state: 'Telanagana',
                country: 'USA',
                postal_code: '500072'
            },
            phone: '4234242424',
            dob: '2000-12-12',
            password: 'AutomationTesting@123',
            email: randomEmail
        };
    }
}
