import {test as base, expect} from '@playwright/test';

let test = base.extend<{studentName: string}>({
    
    studentName: async ({}, use) =>{
        console.log(`1.Fixture Setup`);//pre-requisite of a testcase
        await use(`Sagar`);
        console.log(`3. Fixture TearDown`);//post clean up of a
    }

})


test(`My first custom fixture`, async({studentName})=>{
    console.log(`2. Test Execution`, studentName);
    expect(studentName).toBe(`Sagar`);
    console.log(`Test Execution is completed`)
})