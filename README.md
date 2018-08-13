**Instructions to set up this project**
1) yarn install
2) yarn run start
3) Open your browser and navigate to http://localhost:8081
4) To run test cases, use yarn test
Note: If Yarn commands doesn't work, try installing Yarn using npm install -g yarn

#Application-features
1. Application built using React
2. Rostering information is displayed in table format
3. User can edit shift timings for a shift following below criterias:
a) Back to back shifts are not allowed. Please allow at least 7.5 hours between two different shifts.
b) Shift duration should be maximum of 8.5 hours
c) Shift duration should be more than break duration of the shift
4. User can view number of employees performing a role for the duration by clicking 'View Roles' button. This information is presented in the form of bar chart powered by Highcharts
5. Download bar chart capturing roles data
6. Currently tested on Chrome


**Biarri - Front End Dev Challenge**

For this challenge, we are looking for you to create a simple rostering solution SPA for visualising and editing the shifts of employees. 
For example this could be used for a small business that works 24/7 to manage the shifts of it's employees to make sure everyone gets adequate days off and doesn't get shifts which are directly back-to-back (eg working on a night shift followed by a morning shift the next day)

We're providing you with three mock data JSON files:

 - Configuration: General information about the location which the roster is for including the timezone and title 
 - Employees: The people who are being rostered
 - Shifts: These are the bits of work assigned to employees. If a shift is assigned to an employee, it will have it's employee_id property set to an integer matching the id field on the employee.
 - Role: The type/label of the shift. Each shift will have a role_id which corresponds to a role.

The amount of time you spend on this exercise is up to you, however we're looking for it to meet the following guidelines:

 - The app should use React as a base framework - any library choices beyond this are up to you.
 - The app should display the whole week of rostering information for the employees in the mock data set.
 - The roster must be represented in both a tabular format, and also a visualisation of some form - we're looking for something that would aid end users in understanding the information they're being presented with.
 - The data provides DateTimes in UTC, but the configuration will specify a timezone property - make sure that you're using this to format your date times! We want to see the data in the context of their timezone, not your local time zone.
 - The ability to edit the start/end times of a shift (you do not need to be able to edit any additional data, create or delete shifts)

If any of the requirements are unclear feel free to send through questions for clarification or make assumptions - we are not trying to test you on your knowledge of rostering.

Please create your solution in a fork off this repo.
When you're ready to share your solution with us, email a link to your recruiter or Biarri contact.

While not required, if part of completing this challenge involves wireframing, paper prototyping, mockups or similar please add them to a folder in your repo.

Lastly note that we only suggest spending 2-3 hours on this exercise - it is not meant to be a masterpiece. 
If there are additional things you think you could have done better/did not have enough time to complete, feel free to compile a quick list and bring it to the technical interview to help remind yourself during the discussion.