**Instructions to set up this project**
1) yarn install
2) yarn run start
3) Open your browser and navigate to http://localhost:8081
4) To run test cases, use 'yarn test'
Note: If Yarn commands doesn't work, try installing Yarn using 'npm install -g yarn'

#Application-features
1. Application built using React
2. Rostering information is displayed in table format
3. User can edit shift timings for a shift following below criterias:
a) Back to back shifts are not allowed. Please allow at least 7.5 hours between two different shifts.
b) Shift duration should be maximum of 8.5 hours
c) Shift duration should be more than break duration of the shift
4. User can view number of employees performing a role for the duration by clicking 'View Roles' button. This information is presented in the form of bar chart powered by Highcharts
5. Download bar chart capturing roles data in different formats (png, jpeg, pdf and svg)
6. Currently tested on Chrome
7. Time is displayed as per timezone property present in json file



A simple rostering solution SPA for visualising and editing the shifts of employees. 
For example this could be used for a small business that works 24/7 to manage the shifts of it's employees to make sure everyone gets adequate days off and doesn't get shifts which are directly back-to-back (eg working on a night shift followed by a morning shift the next day)

It is driven with three mock data JSON files:

 - Configuration: General information about the location which the roster is for including the timezone and title 
 - Employees: The people who are being rostered
 - Shifts: These are the bits of work assigned to employees. If a shift is assigned to an employee, it will have it's employee_id property set to an integer matching the id field on the employee.
 - Role: The type/label of the shift. Each shift will have a role_id which corresponds to a role.
