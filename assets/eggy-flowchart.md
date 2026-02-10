# Eggy Chatbot Architecture
```mermaid
flowchart TD
    Start([Page Load]) --> Init[Initialize chatbot state<br/>chatOpened = false]
    Init --> AutoOpen{Wait 4 seconds}
    AutoOpen -->|Timer fires| CheckOpened{chatOpened<br/>== false?}
    CheckOpened -->|Yes| OpenChat[Auto-open chatbot<br/>Show welcome message]
    CheckOpened -->|No| Wait[Continue waiting]
    
    OpenChat --> UserInteract[User interacts with form]
    Wait --> UserInteract
    
    UserInteract --> FormAction{User action?}
    
    FormAction -->|Clicks Eggy icon| Toggle[toggleChat()<br/>Show/hide chatbot]
    FormAction -->|Clicks quick button| QuickMsg[Copy button text to input<br/>Call sendMessage()]
    FormAction -->|Types message + Enter| SendMsg[sendMessage()]
    FormAction -->|Clicks SEND button| SendMsg
    FormAction -->|Changes Stage dropdown| StageLogic[Stage-Based Enablement]
    FormAction -->|Changes Currency dropdown| CurrencyLogic[Currency Monitor]
    FormAction -->|Blur on Amount field| AmountCheck[Threshold Validation]
    FormAction -->|Blur on Date field| DateCheck[Timing Validation]
    FormAction -->|Selects 'Referral' type| ShowUpload[Show invoice upload box]
    
    SendMsg --> AddUserMsg[addMessage(text, isUser=true)]
    AddUserMsg --> ShowTyping[Show 'Eggy is thinking...']
    ShowTyping --> GetAI[getAIResponse(message)]
    
    GetAI --> Wait1200[Wait 1200ms delay]
    Wait1200 --> ParseInput[Convert to lowercase<br/>Pattern matching]
    
    ParseInput --> Match{Keyword match?}
    Match -->|'playbook'/'guide'/'rule'| RespPlaybook[Return playbook response<br/>+ PDF download links]
    Match -->|'limit'/'amount'/'25'| RespThreshold[Return $25k threshold info]
    Match -->|'currency'/'convert'| RespCurrency[Return Treasury converter link]
    Match -->|'extension'/'expire'/'90'| RespExtension[Return 180-day + 90-day rule]
    Match -->|'requirement'/'need'| RespRequirements[Return registration requirements]
    Match -->|'new deal'/'start'| RespNewDeal[Return getting started guide]
    Match -->|'reject'/'denied'| RespRejection[Return rejection reasons]
    Match -->|'referral'| RespReferral[Return referral vs deal info]
    Match -->|'government'/'rfp'| RespGov[Return RFP/bid rules]
    Match -->|'effort'/'proof'| RespEffort[Return presales effort requirements]
    Match -->|'notification'/'after'| RespTimeline[Return post-submission timeline]
    Match -->|'audit'/'compliance'| RespAudit[Return audit & ethics rules]
    Match -->|'hello'/'hi'/'eggy'| RespGreeting[Return Eggy intro]
    Match -->|No match| RespDefault[Return default fallback]
    
    RespPlaybook --> RemoveTyping[Remove typing indicator]
    RespThreshold --> RemoveTyping
    RespCurrency --> RemoveTyping
    RespExtension --> RemoveTyping
    RespRequirements --> RemoveTyping
    RespNewDeal --> RemoveTyping
    RespRejection --> RemoveTyping
    RespReferral --> RemoveTyping
    RespGov --> RemoveTyping
    RespEffort --> RemoveTyping
    RespTimeline --> RemoveTyping
    RespAudit --> RemoveTyping
    RespGreeting --> RemoveTyping
    RespDefault --> RemoveTyping
    
    RemoveTyping --> AddBotMsg[addMessage(response, isUser=false)<br/>Parse with marked.js]
    AddBotMsg --> ScrollChat[Auto-scroll to bottom]
    ScrollChat --> UserInteract
    
    StageLogic --> StageSwitch{Stage value?}
    StageSwitch -->|New Deal| StageNew[Show Masha intro<br/>+ enablement architect pitch]
    StageSwitch -->|Prospecting| StageProsp[Show presales training link]
    StageSwitch -->|Discovery| StageDisc[Show Skilljar LMS link<br/>+ API sync explanation]
    StageSwitch -->|Evaluating| StageEval[Show asset library links]
    StageSwitch -->|Negotiation| StageNeg[Show battlecard note<br/>+ demo disclaimer]
    StageSwitch -->|Closed Won| StageWon[Show congratulations]
    StageSwitch -->|Closed Lost| StageLost[Show strategic review prompt]
    StageSwitch -->|Denied| StageDenied[Show appeals process link]
    
    StageNew --> ForceOpen[Force open chatbot<br/>chatOpened = true]
    StageProsp --> ForceOpen
    StageDisc --> ForceOpen
    StageEval --> ForceOpen
    StageNeg --> ForceOpen
    StageWon --> ForceOpen
    StageLost --> ForceOpen
    StageDenied --> ForceOpen
    
    ForceOpen --> HideNotif[Hide notification badge]
    HideNotif --> AddStageMsg[addMessage(eggyResponse)]
    AddStageMsg --> WaveEggy[Trigger wave animation]
    WaveEggy --> UserInteract
    
    CurrencyLogic --> CheckCurrency{Currency<br/>!= USD?}
    CheckCurrency -->|Yes| CurrAlert[Force open chatbot<br/>Show Treasury converter link]
    CheckCurrency -->|No| UserInteract
    CurrAlert --> UserInteract
    
    AmountCheck --> CheckAmount{Amount<br/>< $25k?}
    CheckAmount -->|Yes| AmountAlert[Force open chatbot<br/>Show threshold warning]
    CheckAmount -->|No| UserInteract
    AmountAlert --> UserInteract
    
    DateCheck --> CheckDate{Days to close<br/>< 14?}
    CheckDate -->|Yes| DateAlert[Force open chatbot<br/>Show timing warning]
    CheckDate -->|No| CheckYear{Year<br/>< 2026?}
    DateAlert --> UserInteract
    CheckYear -->|Yes| YearAlert[Force open chatbot<br/>Show year validation error]
    CheckYear -->|No| UserInteract
    YearAlert --> UserInteract
    
    ShowUpload --> UploadVisible[Upload container<br/>opacity: 1<br/>max-height: 200px]
    UploadVisible --> UserInteract
    
    Toggle --> UserInteract
    QuickMsg --> UserInteract
    
    UserInteract --> Submit{User clicks<br/>Submit?}
    Submit -->|Form valid| HideForm[Hide form + headers + banner]
    Submit -->|Invalid| UserInteract
    HideForm --> ShowSuccess[Show success message]
    ShowSuccess --> Confetti[Trigger confetti animation]
    Confetti --> End([End])
    
    style Start fill:#d8b4fe
    style End fill:#22c55e
    style GetAI fill:#a855f7,color:#fff
    style ForceOpen fill:#E11A22,color:#fff
    style Match fill:#fcd34d
    style StageSwitch fill:#fcd34d
```
