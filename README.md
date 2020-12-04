# CIS550Project

## Extra Credit

Three EC points to implement for 10% bonus. 

* Deployment on Heroku
* NoSQL MongoDB to store favourite players, teams and searches of users
* Unit Testing > 80% Code Coverage for Backend using Mocking? // User Login Experience (use amazon cognito, need to integrate with Google, Facebook)

## Guidelines from Canvas with Our Implementation

The project will be graded out of 100 points. We will not be disclosing the exact rubric untilthe projects have been graded, but the seven following criteria will be used to evaluateyour work. The percentage next to each criteria indicates the portion of the final scoreattributed to that criteria.

1. Technical Quality - 30% ​(Does the application solve a non-trivial problem or answernon-trivial questions? Is the application robust and functional? Are some of the queriescomplex? Is the database designed well? Is the schema normalized? Was entity resolutionand data cleaning performed correctly? Does the application perform interesting joinsbetween data from different sources?)

* Non-trivial problem: Data lookup for team/player level data aggregated across multiple decades. 
* Complex Queries -
* Database Design - ***Decide what NF***
* Interesting Joins -

2. Scope - 25% ​(Does the application implement a sufficient number of features? Does theapplication have multiple pages? Does each page interact with a database? Are the datasetslarge?)

* Datasets are large enough - ***Checked???***
* Multiple Pages of Application:
    * Login Page - linked to mongoDB and Amazon Cognito DB
    * Home Page - linked to main AWS DB, show top 10 players of last season, top 10 player of all time in dataset, top 10 clubs of last season, top 10 clubs of all time
    * Players to follow Page - linked to mongoDB and main DB, can favourite players or teams and have them show up here. 
    * Match Search Page - Find specific match and associated data
    * Player Search Page - Find specific player data aggregated across period
    * Bet Simulator - get suggested 10 bets based on your favourited players/teams and choose what bet to take for each match. Then see if you made any money based on actual result

3. Presentation - 20% ​(Is the final report written using clear and concise language andcorrect grammar? Is the final report well-organized and easy to read? Does the final reportmake use of charts and tables when appropriate? During the video demo, is the narratoreasier to hear and understand? Is the information presented accurate? )
    * Final Report Cleanliness
    * Use of Charts and Tables  - ***Checked???***
    * Good Video - ***Who and How?***
4. Optimization - 15% ​(Did the developers attempt to optimize their more complex queriesusing relevant optimization techniques (e.g. improving the query, caching, indexing)?  Doesthe final report provide reasonable, correct explanations for why each optimization failed orsucceeded? Does the final report include relevant and accurate pre and post optimizationtimings?)
    * Optimizations we could try:
        * Projecting early on to reduce size of intermediate results
        * Indexing
        * Temporary Tables

    * Can have some that failed/succeeded - ***In Final Report?***
        * How to time using front end - ***Find package***
6. Look and feel - 10% ​(Is the application visually appealing? Is the user interface easy touse? Does the application make use of data visualizations and images when appropriate andfeasible?)
    * CSS - Final Step
    * Images of Players available???
    * Logos of football clubs - new database to join on 
    * Data Visualization - Strength Polygon for players - Other easier ideas? 
    
5. Group Dynamics - Multiplier [0.5-1]  ​(Did all members of the team contribute to theproject? Were all members of the team given the opportunity to contribute to the project?Did team members work cooperatively and support each other? As an individual, did youcomplete your fair share of the work? As an individual, did you fully complete the tasksassigned to you by the group in a timely manner? As an individual, did you communicatewith your group members regarding your ability to meet internal deadlines, as necessary?)