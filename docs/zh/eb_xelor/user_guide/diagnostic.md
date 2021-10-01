# Diagnostic

EB xelor HPC reference integrates the diagnostic over IP on RT_RefApp with services configuration.

## Overview
DoIp according to ISO13400-2:2011 is implemented.
One tester with address 0x00EF8 for IPv4 and 0x00EF9 for IPv6 is supported.
Physical addressing is supported on target address 0x1148 and functional addressing on 0xEEF8.


## Diagnostic services
The following services are supported:

* DiagnosticSessionControl (0x10)
* EcuReset (0x11)
* SecurityAccess (0x27)
* CommunicationControl (0x28)
* TesterPresent (0x3E)
* ControlDTCSetting (0x85)
* ResponseOnEvent (0x86)
* ReadDataByIdentifier (0x22)
* WriteDataByIdentifier (0x2E)
* ClearDiagnosticInformation (0x14)
* ReadDTCInformation (0x19)
* RoutineControl (0x31)

image:82E43D9D-4A27-4b12-9A39-8A042C0EA74F.png[Architecture,scaledwidth="75%"]


### DiagnosticSessionControl (0x10)
RT_RefApp supports DiagnosticSessionControl (0x10). Subservice configuration :

| Name        | ID    | Security  | Session |
| -- | -- | -- | -- |
| Default     | 0x01  | Tbd       | Default, Programming, Extended |
| Programming | 0x02  | Tbd       | Default, Programming, Extended |
| Extended    | 0x03  | Tbd       | Default, Programming, Extended |


### EcuReset (0x11)
RT_RefApp supports EcuReset (0x11). Subservice configuration :

| Name          | ID    | Security  | Session |
| -- | -- | -- | -- |
| hardReset     | 0x01  | Tbd       | Default, Programming, Extended|


### SecurityAccess (0x27)
RT_RefApp supports SecurityAccess (0x27). Subservice configuration :

| Name                     | ID    | Security  | Session |
| -- | -- | -- | -- |
| level1_Seed_requestSeed  | 0x01  | Tbd       | Extended, Programming |
| Level1_Seed_sendKey      | 0x02  | Tbd       | Extended, Programming |
| Level3_Seed_requestSeed  | 0x03  | Tbd       | Extended |
| Level3_Seed_sendKey      | 0x04  | Tbd       | Extended |


### CommunicationControl (0x28)
RT_RefApp supports CommunicationControl (0x28). Subservice configuration :

| Name                  | ID    | Security  | Session|
|--|--|--|--|
| enableRxAndTx         | 0x00  | Tbd       | Extended, Programming|
| enableRxAndDisableTx  | 0x01  | Tbd       | Extended, Programming|
| disableRxAndEnableTx  | 0x02  | Tbd       | Extended, Programming|
| disableRxAndTx        | 0x03  | Tbd       | Extended, Programming|


### TesterPresent (0x3E)
RT_RefApp supports TesterPresent (0x3E). Subservice configuration :

| Name              | ID    | Security  | Session|
|--|--|--|--|
| zeroSubFunction   | 0x00  | Tbd       | Default, Extended|


### ControlDTCSetting (0x85)
RT_RefApp supports ControlDTCSetting (0x85). Subservice configuration :

| Name   | ID    | Security  | Session|
|--|--|--|--|
| on     | 0x01  | Tbd       | Extended, Programming|
| off    | 0x02  | Tbd       | Extended, Programming|

### ResponseOnEvent (0x86)
RT_RefApp supports ResponseOnEvent (0x86). Subservice configuration :

| Name                  | ID    | Security  | Session|
|--|--|--|--|
| stopResponseOnEvent   | 0x00  | Tbd       | Default, Extended|
| startResponseOnEvent  | 0x05  | Tbd       | Default, Extended|


### ReadDataByIdentifier (0x22)
RT_RefApp supports ReadDataByIdentifie (0x22). Supported Data Identifier for read :

| Name                                     | ID      | Security  | Session|
|--|--|--|--|
| DcmDspDid_ActiveDiagnosticInformation    | 0xF186  | Tbd       | Default, Programming, Extended|
| DcmDspDid_NVM_TEST_BLOCK                 | 0xF190  | Tbd       | Default, Programming, Extended|
| DcmDspDid_VersionInformation             | 0xF19A  | Tbd       | Default, Programming, Extended|


### WriteDataByIdentifier (0x2E)
RT_RefApp supports WriteDataByIdentifier (0x2E). Supported Data Identifier for read :

| Name                        | ID      | Security  | Session|
|--|--|--|--|
| DcmDspDid_NVM_TEST_BLOCK    | 0xF190  | Tbd       | Default, Programming, Extended|


### ClearDiagnosticInformation (0x14)
RT_RefApp supports ClearDiagnosticInformation (0x14). Subservice configuration :

| Name    | ID  | Security  | Session|
|--|--|--|--|
| none    | N/A | Tbd       | Default, Extended|


### ReadDTCInformation (0x19)
RT_RefApp supports ReadDTCInformation (0x19). Subservice configuration :

| Name                                                | ID    | Security  | Session|
|--|--|--|--|
| reportNumberOfDTCByStatusMask                       | 0x01  | Tbd       | Default, Extended|
| reportDTCByStatusMask                               | 0x02  | Tbd       | Default, Extended|
| reportDTCSnapshotRecordByDTCNumber                  | 0x04  | Tbd       | Default, Extended|
| reportDTCExtDataRecordByDTCNumber                   | 0x06  | Tbd       | Default, Extended|
| reportSupportedDTC                                  | 0x0A  | Tbd       | Default, Extended|
| reportDTCFaultDetectionCounter                      | 0x14  | Tbd       | Default, Extended|
| reportUserDefMemoryDTCByStatusMask                  | 0x17  | Tbd       | Default, Extended, Programming|
| reportUserDefMemoryDTCSnapshotRecordByDTCNumber     | 0x18  | Tbd       | Default, Extended, Programming|
| reportUserDefMemoryDTCExtDataRecordByDTCNumber      | 0x19  | Tbd       | Default, Extended, Programming|

### RoutineControl (0x31)
RT_RefApp supports RoutineControl (0x31). Service configuration :

| Name                        | ID     | Security  | Session|
|--|--|--|--|
| DIAGNOSTIC_LOOPBACK         | 0x0100 | Tbd       | Extended|
| DIAGNOSTIC_TRIGGER_DTC      | 0x0101 | Tbd       | Extended|
