export const TC_01_LoginOrangeHrm = {
    username: 'admin',
    invalidPassword: 'WrongPassword@123',
    validPassword: 'Admin@123',
    emptyValue: '',
    dashboardText: 'Dashboard',
    invalidCredentialsPattern: /invalid|credential|password/i
}

export const TC_02_EmployeeSearch = {
    adminUsername: 'admin',
    adminPassword: 'Admin@123',
    partialEmployeeName: 'Mazie',
    expectedEmployeeName: 'Mazie Abraham',
    expectedJobTitle: 'Marketing Executive',
    expectedLocation: 'Sydney Hub',
    emptyValue: '',
    allStatus: 'All'
}

export const TC_04_UpdateEmployee = {
  adminUsername: 'admin',
  adminPassword: 'Admin@123',
  employeeName: 'Mazie Abraham',
  newGender: 'Male',
  genderValue: 'string:1',
  newMaritalStatus: 'Single',
  maritalStatusValue: 'string:1',
  newNationality: 'Indian',
  nationalityValue: 'string:82',
  newBirthday: '1990-08-15',
  newStreetAddress: 'Plot 12, MG Road',
  newCity: 'Hyderabad',
  newState: 'Telangana',
  newZip: '500081',
  newMobile: '9876543210'
}

export const TC_05_EmployeeAttachment = {
  adminUsername: 'admin',
  adminPassword: 'Admin@123',
  employeeName: 'Mazie Abraham',
  partialEmployeeName: 'Mazie',
  fileName: 'Playwright-Cheat-Sheet.pdf',
  description: 'Uploaded by Playwright automation',
  noDataMessage: 'Sorry, No Data Found!',
  uploadSuccessPattern: /success|saved|uploaded/i,
  deleteSuccessPattern: /success|deleted|removed/i
}

export const TC_06_LoginUserValidation = {
  adminUsername: 'admin',
  adminPassword: 'Admin@123',
  newUsername: 'Test128',
  newPassword: 'Test@12345678',
  employeeSearchText: 'aar',
  employeeName: 'Aaron Hamilton',
  roles: {
    ess: 'Default ESS',
    supervisor: 'Default Supervisor',
    admin: 'Report Admin'
  },
  statuses: {
    enabled: 'Enabled',
    disabled: 'Disabled'
  },
  allStatus: 'All',
  disabledLoginErrorPattern: /disabled|invalid/i
} as const;

export const TC_07_EmployeeValidation = {
  adminUsername: 'admin',
  adminPassword: 'Admin@123',
  partialEmployeeName: 'Mazie',
  employeeName: 'Mazie Abraham',
  emptyValue: ''
}

export const TC_11_RecruitmentValidation = {
  adminUsername: 'admin',
  adminPassword: 'Admin@123',
  vacancyNamePrefix: 'Playwright Vacancy ',
  vacancyDescription: 'This vacancy is created for Playwright validation automation testing.',
  descriptionPattern: /Playwright|validation|automation/i,
  vacancySaveResponsePattern: /success|saved|saved successfully|Vacancy/i
}