# SugarDrawer
* [Japanese edition](README_jp.md)
* latest version: 1.8.1 
  * [Change log](./CHANGELOG.md#170-20211208)

## JAAG Integration Notes

This repository is vendored into JAAG and built as part of JAAG’s frontend. Some changes have been made to the SugarDrawer UI to accommodate JAAG. During install/build, JAAG applies small corrective patches to SugarSketcher structures via `apply-patches.js`. For Apache-2.0 compliance, JAAG automatically inserts a short "modified by" header into SugarDrawer and the patched SugarSketcher file to indicate changes were made for integration.

## Requirement
* JavaScript (ECMAScript2015, ES6)
* Node.js (10.19.0)
* Node Package Manager (6.14.8)
* SugarSketcher (https://gitlab.com/glycoinfo/SugarSketcher_arranged.git)

## Compile

### 1. Install libraries
At first, developer must run below command.\
This command will install the libraries necessary to run SugarDrawer.

```
$ npm install
```

After the library installation is finished, `node_modules` directory will be added in SugarDrawer directory.\
**Note: please do not edit or delete any files in node_modules directory.**
```
{YOUR_PROJECT_DIRECTORY}/glycoinfo/sugardrawer/nome_modules
```

### 1.1 Apply sugar-sketcher patches
**Important:** After installing dependencies, apply the GAG structure fixes:

```
$ npm run patch
```

This command applies corrections to GAG (glycosaminoglycan) structure definitions:
- **gagdermatan**: b-dido → a-lido
- **gagheparin**: Complete structure correction
- **gagheparan**: b-dglc → a-dglc and a-dido → a-lido

**Note:**
- Patches are automatically applied during `npm install` (via postinstall) and before each build (via prebuild)
- The patching uses a cross-platform Node.js script (apply-patches.js) that works on Windows, Mac, and Linux
- If automatic patching fails, run `npm run patch` manually
- When patches are applied, a short "modified by" comment is added to the patched SugarSketcher file to indicate changes for downstream users.

### 2. Build source code

There are three different builds available for SugarDrawer.\
The following command will build all the source code of SugarDrawer.

```
$ npm run build
```

If you would like to release the SugarDrawer in public, please execute the following command.

```
$ npm run release
```

If you would like to test your changes immediately while developing SugarDrawer, please run the following command.\
This command will automatically build the source code when changes are made to it.

```
$ npm run watch
```

#### Build options
The search API referenced by the "Search" function can be changed by environment variables.\
Environment variables in Node.js are specified by `NODE_ENV=`.\
Add an environment variable of the search API to the SugarDrawer build command:

```
$ NODE_ENV={API_NAME} npm run build
```

```
$ NODE_ENV={API_NAME} npm run release
```

You can use the following search APIs:

|API_NAME|API|
|----|----|
|development|https://glytoucan.org/Structures/Glycans/{GlyTouCan_ID}|
|release|https://glycosmos.org/glycans/show/{GlyTouCan_ID}|
|glyconavi|https://glyconavi.org/hub/?wurcs={WURCS}|

If you execute the build commands without selecting any environment variables, `NODE_ENV=development` will be automatically selected for `npm run build` and `NODE_ENV=release` for `npm run release`.

### 3. Run SugarDrawer
When the source code is finished building, `dist` directory will be generated in the SugarDrawer.
```
{YOUR_PROJECT_DIRECTORY}/glycoinfo/sugardrawer/dist
```

`dist` directory contains `app.bundle.js` and `index.html`.

* app.bundle.js
    * It is bundle files of SugarDrawer.
* index.html 
    * It is html files of displaying SugarDrawer.
<!--
* dist.bundle.js.map
    * It is source files of SugarDrawer for developers.
-->

Please run `index.html` in any browser.  It will output an interface to the following image.

<img width="600" alt="missing image" src="https://user-images.githubusercontent.com/15099705/186841550-bbadb319-3631-402d-b7d1-6a7f8b1c94fd.png">

### 4. Incorporate SugarDrawer into your website

If you would like to incorporate SugarDrawer into your website, add the following elements to your source file.

#### head element
```
<head>
    ...

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/semantic.min.css">
    <script type="text/javascript" src="https://d3js.org/d3.v3.min.js"></script>
</head>
```

#### body element
```
<body>
    ...

    <div id="titleHeader"></div>
    <div id="interFace" oncontextmenu="return false;"></div>
    <div id="menu" style="display: none" oncontextmenu="return false;"></div>
    <div id="idtable" oncontextmenu="return false;"></div>
    <div id="textArea" oncontextmenu="return false;"></div>
    <script type="text/javascript" src="{your_js_source_directory}/app.bundle.js"></script>
</body>
```

## Restrictions

### Divalent substituent (1.1.0 or later)

In general, monosaccharides undergo modification with monovalent substituents such as sulfate groups, or multivalent substituents such as pyruvate.\
In SugarDrawer, the substituent attached the monosaccharide can not have multiple linkages.\
Thus, the following multivalent substituents can not supported:
- Pyruvate
- (R)-Pyruvate
- (S)-Pyruvate
- (R)-Lactate
- (S)-Lactate

### Unsupported monosaccharides (1.5.0 or later)
The following monosaccharides are not support in the SugarDrawer:

|Name|Symbol|
|:----:|:------:|
|Sia|![image](https://user-images.githubusercontent.com/15099705/144167570-3d5f4028-10b0-44e5-b64a-a8dce6711f06.png)|
|Pse|![image](https://user-images.githubusercontent.com/15099705/144167631-6b82aac3-d15a-40b4-a9a3-4eb29d0a464d.png)|
|Leg|![image](https://user-images.githubusercontent.com/15099705/144167648-0fa247d4-3abf-4223-921f-783056ad8df8.png)|
|Aci|![image](https://user-images.githubusercontent.com/15099705/144167668-7da060c1-da1d-41bd-ad55-dc51f069345c.png)|
|4eLeg|![image](https://user-images.githubusercontent.com/15099705/144167682-d41d5a6f-c09b-4cf9-a7d4-2565655ac366.png)| 
|Di-deoxynonulosonate|![image](https://user-images.githubusercontent.com/15099705/144167772-3b518b0a-c38f-4ce1-8daf-e6e0a86d480b.png)| 

## Example
A demo edition is available at the following URL (current version: 1.7.0):
- https://glycoinfo.gitlab.io/sugardrawer/sugar-drawer-pages

## Publications
Now preparing submit a paper about this tool.
* [Shinichiro Tsuchiya, Masaaki Matsubara, Kiyoko F. Aoki-Kinoshita and Issaku Yamada, "SugarDrawer: A Web-Based Database Search Tool with Editing Glycan Structures" 
Molecules 26.23 (2021):7149.](https://doi.org/10.3390/molecules26237149)
