export class ThinkingTesterUserBuilder {
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

    static createUser() {
        const firstName = this.createRandomFirstName();
        const lastName = this.createRandomLastName();
        const randomEmail = this.createRandomEmail();

        return {
                "firstName": firstName,
                "lastName": lastName,
                "email": randomEmail,
                "password": "test@123"
        };
    }
}
