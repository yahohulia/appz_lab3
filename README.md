## Загальна архітектура

```
┌─────────────────────────────────────────┐
│                  UI Layer               │
│         (console, showScreens,          │
│              ticketScreens)             │
└──────────────┬──────────────────────────┘
               │ використовує
               │ IShowService, ITicketService
┌──────────────▼──────────────────────────┐
│             BLL Layer                   │
│   (ShowService, TicketService,          │
│    TheatreMapper, DTO)                  │
└──────────────┬──────────────────────────┘
               │ використовує
               │ IUnitOfWork
┌──────────────▼──────────────────────────┐
│             DAL Layer                   │
│   (UnitOfWork, TypeOrmRepository,       │
│    DataContext, Entities)               │
└─────────────────────────────────────────┘
```

---

## DAL — Data Access Layer

```mermaid
classDiagram
    class ShowEntity {
        +string id
        +string title
        +string author
        +string genre
        +string date
        +number totalSeats
        +number availableSeats
        +number ticketPrice
    }

    class TicketEntity {
        +string id
        +string showId
        +string buyerName
        +number seatNumber
        +string purchaseDate
        +number pricePaid
        +boolean isReturned
    }

    class IRepository~T~ {
        <<interface>>
        +getAll() Promise~T[]~
        +getById(id) Promise~T~
        +create(entity) Promise~T~
        +update(entity) Promise~T~
        +delete(id) Promise~boolean~
        +find(predicate) Promise~T[]~
        +findOne(predicate) Promise~T~
    }

    class IDataContext {
        <<interface>>
        +shows IRepository~ShowEntity~
        +tickets IRepository~TicketEntity~
    }

    class IUnitOfWork {
        <<interface>>
        +shows IRepository~ShowEntity~
        +tickets IRepository~TicketEntity~
        +saveChanges() Promise~void~
        +beginTransaction() void
        +commitTransaction() Promise~void~
        +rollbackTransaction() void
    }

    class TypeOrmRepository~T~ {
        -Repository~T~ repo
        +getAll() Promise~T[]~
        +getById(id) Promise~T~
        +create(entity) Promise~T~
        +update(entity) Promise~T~
        +delete(id) Promise~boolean~
        +find(predicate) Promise~T[]~
        +findOne(predicate) Promise~T~
    }

    class DataContext {
        -DataSource dataSource
        +shows IRepository~ShowEntity~
        +tickets IRepository~TicketEntity~
    }

    class UnitOfWork {
        -IDataContext context
        +shows IRepository~ShowEntity~
        +tickets IRepository~TicketEntity~
        +saveChanges() Promise~void~
        +beginTransaction() void
        +commitTransaction() Promise~void~
        +rollbackTransaction() void
    }

    class AppDataSource {
        +DataSource instance
    }

    IRepository <|.. TypeOrmRepository
    IDataContext <|.. DataContext
    IUnitOfWork <|.. UnitOfWork
    DataContext --> TypeOrmRepository
    DataContext --> AppDataSource
    UnitOfWork --> IDataContext
    DataContext ..> ShowEntity
    DataContext ..> TicketEntity
```

---

## BLL — Business Logic Layer

```mermaid
classDiagram
    class ShowDto {
        +string id
        +string title
        +string author
        +string genre
        +Date date
        +number totalSeats
        +number availableSeats
        +number ticketPrice
    }

    class TicketDto {
        +string id
        +string showId
        +string showTitle
        +Date showDate
        +string buyerName
        +number seatNumber
        +Date purchaseDate
        +number pricePaid
        +boolean isReturned
    }

    class CreateShowDto {
        +string title
        +string author
        +string genre
        +Date date
        +number totalSeats
        +number ticketPrice
    }

    class BuyTicketDto {
        +string showId
        +string buyerName
    }

    class ReturnTicketDto {
        +string ticketId
    }

    class OperationResult~T~ {
        +boolean success
        +T data
        +string error
    }

    class IShowService {
        <<interface>>
        +getAllShows() Promise~ShowDto[]~
        +getShowById(id) Promise~ShowDto~
        +createShow(dto) Promise~OperationResult~
        +updateShow(id, dto) Promise~OperationResult~
        +deleteShow(id) Promise~OperationResult~
        +getUpcomingShows() Promise~ShowDto[]~
    }

    class ITicketService {
        <<interface>>
        +buyTicket(dto) Promise~OperationResult~
        +returnTicket(dto) Promise~OperationResult~
        +getTicketsByShow(showId) Promise~TicketDto[]~
        +getTicketsByBuyer(name) Promise~TicketDto[]~
        +getTicketById(id) Promise~TicketDto~
    }

    class ShowService {
        -IUnitOfWork uow
        +getAllShows() Promise~ShowDto[]~
        +getShowById(id) Promise~ShowDto~
        +createShow(dto) Promise~OperationResult~
        +updateShow(id, dto) Promise~OperationResult~
        +deleteShow(id) Promise~OperationResult~
        +getUpcomingShows() Promise~ShowDto[]~
    }

    class TicketService {
        -IUnitOfWork uow
        +buyTicket(dto) Promise~OperationResult~
        +returnTicket(dto) Promise~OperationResult~
        +getTicketsByShow(showId) Promise~TicketDto[]~
        +getTicketsByBuyer(name) Promise~TicketDto[]~
        +getTicketById(id) Promise~TicketDto~
    }

    class TheatreMapper {
        +toShowDto(entity) ShowDto
        +toShowEntity(dto) ShowEntity
        +toTicketDto(entity, show) TicketDto
    }

    IShowService <|.. ShowService
    ITicketService <|.. TicketService
    ShowService --> IUnitOfWork
    TicketService --> IUnitOfWork
    ShowService ..> TheatreMapper
    TicketService ..> TheatreMapper
    ShowService ..> ShowDto
    ShowService ..> CreateShowDto
    ShowService ..> OperationResult
    TicketService ..> TicketDto
    TicketService ..> BuyTicketDto
    TicketService ..> ReturnTicketDto
    TicketService ..> OperationResult
    TheatreMapper ..> ShowDto
    TheatreMapper ..> TicketDto
```

---

## UI Layer

```mermaid
classDiagram
    class index {
        +main() void
        -seedDemoData(service) void
    }

    class showScreens {
        +showManagementMenu(service) void
        -listAllShows(service) void
        -listUpcomingShows(service) void
        -addShow(service) void
        -editShow(service) void
        -deleteShow(service) void
    }

    class ticketScreens {
        +ticketManagementMenu(ticketSvc, showSvc) void
        -buyTicket(ticketSvc, showSvc) void
        -returnTicket(ticketSvc) void
        -ticketsByShow(ticketSvc, showSvc) void
        -ticketsByBuyer(ticketSvc) void
        -findTicketById(ticketSvc) void
    }

    class console {
        +ask(prompt) Promise~string~
        +askNumber(prompt) Promise~number~
        +askFutureDate(prompt) Promise~Date~
        +askMenu(options) Promise~number~
        +printLine(text) void
        +printError(text) void
        +printSuccess(text) void
        +printInfo(text) void
        +formatDate(date) string
        +formatMoney(amount) string
        +closeInput() void
    }

    index --> showScreens
    index --> ticketScreens
    index --> IShowService
    index --> ITicketService
    showScreens --> IShowService
    showScreens --> console
    ticketScreens --> ITicketService
    ticketScreens --> IShowService
    ticketScreens --> console
```
