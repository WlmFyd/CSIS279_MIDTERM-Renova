# Renova
## Maintenance Management


### Introduction
**Renova** is a maintenance management app that serves the purpose of creating maintenance tickets for buildings in order to track progress and urgency.

This project is a *demo* of the intended product. Left out features include (but are not limited to):
* Authentication support (JWT support, with a registration login form).
* Authorization methods (protected API routes).
* Building managers implementation.
* Conditional rendering.


### Database details:
* users
  * id \[PK]
  * name
  * email \[UNIQUE]
  * password
  * type \[ENUM: User | Manager | Admin]
    
* buildings
  * id \[PK]
  * name
  * type \[ENUM: Residential | Institutional | Other]
    
* tickets
  * id \[PK]
  * title
  * desc
  * urgency \[ENUM: Low | Medium | High | Critical]
  * status \[ENUM: Pending | In-Progress | Resolved | Rejected]
  * allowComments
  * fromUserId
  * forBuildingId
    
* comments
  * id \[PK]
  * text
  * fromUserId
  * ticketId

ERD Diagram:
<img width="924" height="843" alt="erd_renova" src="https://github.com/user-attachments/assets/6b879f01-8233-47b0-9fe0-68d377dd0093" />
