# Hotspots: AI-Powered Wildfire Detection & Response System

> 🏆 Entry for Google Cloud's Agent Development Kit Hackathon 2025

An innovative multi-agent AI system designed to monitor and mitigate active and potential fires in cities using Google Cloud's Agent Development Kit (ADK).

## Overview

Hotspots leverages multiple AI agents working together to detect, analyze, and respond to wildfire threats in urban environments. The system uses a cell-based approach to monitor areas, predict fire risks, and coordinate response efforts automatically.

## Technical Architecture

### Core Components

#### 1. Cell System
Each monitored area is divided into cells with the following properties:
- **Location**: Coordinate data
- **Environmental Data**:
  - Windspeed
  - Wind direction
  - Terrain type
- **Available Resources**:
  - Personnel
  - Aircraft
  - Vehicles
- **Fuel Characteristics**:
  - Classification
  - Percentage
- **Fire Status**:
  - Probability
  - Size
  - Severity indicators

#### 2. SourceDB
- Purpose: Simulated cell state management
- Features:
  - Rule-based state updates
  - Wind pattern integration

#### 3. WildfireMonitor
- Continuously polls SourceDB
- Detects existing and potential fires
- Emits detection events with:
  - Cell information
  - Fire characteristics:
    - Probability
    - Size
    - Individual fire severity
  - Detection severity
  - Status tracking (Active/Predicted/Mitigated)

#### 4. DetectionMonitor
Processes active and predicted detections to generate response plans:
- **MitigationPlan Structure**:
  - Ordered flag (boolean)
  - Action array containing:
    - Target cell
    - Action type:
      - `deploy_drone`
      - `deploy_man`
      - `evacuate_cell`
      - `none_needed`

#### 5. PlanHandler
Executes mitigation plans with the following action mappings:
- `deploy_drone`: Drone deployment logic
- `deploy_man`: Add personnel resources
- `evacuate_cell`: Gradual personnel evacuation
- `none_needed`: Confirmation of mitigation

## Development Status
🚧 Currently under active development for the Google Cloud ADK Hackathon