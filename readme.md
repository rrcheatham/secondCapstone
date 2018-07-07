# The Fintech Guru Expense Tracker

![Screenshot of account page](screenshot.png)

*website: https://salty-sands-51300.herokuapp.com/*

This is a simple expense tracker that gives users the ability
to track, manage, and target their monthly expenses over the course
of a full year.

Upon logging in **(username: user1, password: b1234567890)**, a user has
access to an inputs section, a graphs section, and a detailed section.

## Inputs

At the top of the page are three inputs:

    1. A dropdown were users can select the month to display
    2. A form for inputing new expenses
    3. A form showing the selected month's budget

### Adding a new expense 

There are 5 main categories of expenses that are tracked:

**Shopping** - all descretionary spending including food, drink, 
clothes, and entertainment

**Housing** - all expenses related to housing including rent/mortgage, 
property taxes, furniture, services, and cleaning supplies

**Transportation** - all expenses related to commuting and travel including
car payments/purchases, public transportation, flights and hotels

**Healthcare** - all expense related to health care including doctors visits, 
prescription and OTC drugs, first aid supplies, and insurance

**Other** - all other expenses including cash contributions and donations

To add a new expense, users simply enter the amount and select both the category and month 
from the drop down menus before clicking submit. The account summary will automatically 
refresh to show the new data.

### Setting/Editing the monthly budget

There is one budget item per category per month that users can edit (each is set to 0 intially) 
the values for which are displayed in the form below the new expense input. To edit a budget total,
a user must select the desired month from the drop down menu at the top of the page, enter the new
budget figure next to the proper category, and hit submit. The account summary will automatically
refresh to show the new data. 

## Graphs

There are four total visualizations to help users track their spending:

**Monthly Actuals vs. Budget** - shows total actuals and budget by category
for the month selected at the top of the page

**Monthly Actuals By Category** - a pie chart showing the breakdown of expenses
by category for the month selected.

**Full Year Expenses By Category** - a series of charts showing expenses by 
category for each month of the year.

**Full Year Actual vs. Budget** - a chart showing total expenses vs total 
budget for each month of the year

## Detailed Table

The final section of the account summary shows a detailed table of actual expenses
for the month selected. 

### Deleted an expense

To delete an actual expense users click on the delete button next to the expense 
they would like to remove. The table and monthly graphs will update automatically.

## New User Sign Up

On the home page, new users can find a link below the login form to create a new
account. A username, password, and email address are required to set up an account.

