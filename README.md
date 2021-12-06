# ChassisSim Converter

A cli based tool to convert Race Chrono CSV file into ChassisSim Monster file.

## Usage

The tool is focused on command line calls, it will convert file paths added to the argument execution list or mouse dragged file list.

```powershell
Usage mode: csim-converter(.exe) FILE_PATH [...FILE_PATH]
  FILE_PATH     Race Chrono CSV file path.
```

## Development

Install the project as any NodeJs one:

```powershell
npm i --no-optional
```

Build to all platforms or a determined one:
* ```powershell
  npm run build
  ```
* ```powershell
  npm run build:linux
  ```
* ```powershell
  npm run build:mac
  ```
* ```powershell
  npm run build:win
  ```

## Docker Build

To build executables without installing node itself, use docker with the bellow command:

```ps1
docker run -v "${pwd}:/csim-converter" --rm node:lts-alpine sh -c 'cd /csim-converter && npm ci --no-optional && npm run build'
```
