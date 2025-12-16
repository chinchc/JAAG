# JAAG: a JSON input file Assembler for AlphaFold 3 with Glycan integration 

JAAG is a comprehensive web-based tool for generating AlphaFold 3 input JSON files with advanced glycan structure support and integrated SugarDrawer functionality.
Web tool link: https://biofgreat.org/JAAG/
Full tutorial PDF: https://biofgreat.org/Tutorial.pdf
Full tutorial PowerPoint with animation: https://biofgreat.org/Tutorial.pptx

## Key Features

### AlphaFold 3 JSON Generation
- **Complete AF3 v4 Support**: Full implementation of AlphaFold 3 v4 input format specification
- **Multi-sequence Modeling**: Support for protein, ligand, RNA, and DNA sequences in complex assemblies
- **Real-time JSON Generation**: Automatic JSON updates as inputs change with live validation
- **Sequence Multimer**: Automatic appending of iterated alphabets after the user-defined chain ID
- **Advanced Configuration**: Model seeds generator (single/multiple), MSA files, templates, custom CCDs
- **AF 3 Input Full Guide**: https://github.com/google-deepmind/alphafold3/blob/main/docs/input.md
### Glycan Structure Management
- **Integrated SugarDrawer**: Built-in glycan drawing interface with popup modal support
- **GlycoCT Processing**: Full GlycoCT format parsing and conversion to bondedAtomPairs + CCD codes
- **Substituent Handling**: Support for glycan sulfation, phosphorylation, acetylation and methylation
- **Glycoinformatics Database Lookup**: Look up glycan information from GlyGen and GlyTouCan

### Protein Glycosylation
- **Sequon Detection**: Detection of N-linked glycosylation sequons (N-X-S/T)
- **Glycosylation Sites**: Manual addition of custom glycosylation sites
### Glycan-related AF3 Model Interpretation: 
Chin Huang, Natarajan Kannan, Kelley W Moremen, Modeling glycans with AlphaFold 3: capabilities, caveats, and limitations, Glycobiology, Volume 35, Issue 10, October 2025, cwaf048, https://doi.org/10.1093/glycob/cwaf048
## Quick Start (through server: https://biofgreat.org/JAAG/)
1. **Basic Setup**: Enter job name
2. **Add Sequences**: Use the sequence buttons to add proteins, ligands, RNA, or DNA
3. **Draw Glycans**: Click the pencil icon to open SugarDrawer for glycan structure drawing  
   **Alternatives**: Copy and paste GlycoCT from a glycoinformatics database
4. **Generate JSON**: JSON is automatically generated in real-time
5. **Export**: Copy or download your complete AlphaFold 3 input file

## Quick Start (through download)
1. **Download**: Download or clone this repo to your local machine
2. **Install Dependencies**: Install Node.js then in SugarDrawer directory, run:
   ```
   npm install
   ```
   ```
   npm run build
   ```
   SugarDrawer will be built and the GAG templates will be patched
3. **Open the Tool**: Launch `index.html` in a modern web browser

## Guide

### Basic Protein Job Example
1. Job Name: `b3gnt2_dimer`
2. Add protein sequence with chain ID `BTHREEGNTTWO`  
   Note: only alphabets are allowed
3. Enter sequence: `MSVGRRRIKL...`  
   Alternatives: enter UniProt ID `Q9NY97` to fetch the sequence
4. Toggle Count to 2 for dimer
5. Complete JSON is ready for AlphaFold 3

### Glycoprotein
1. Add protein sequence
2. Enable "Detect sequons" to detect N-glycosylation sites  
   Alternatives: manually add glycosylation sites
3. Draw glycan structure using SugarDrawer and export  
   Alternative 1: select glycan from templates  
   Alternative 2: copy and paste GlycoCT from glycoinformatics database
4. CCDs and bondedAtomPairs are automatically generated
5. Complete JSON is ready for AlphaFold 3

### Glycan as Ligand
1. Add protein sequence
2. Add ligand sequence
3. Draw glycan structure using SugarDrawer and export  
   Alternatives: copy and paste GlycoCT from glycoinformatics database
4. Define custom bondedAtomPairs if needed (optional)
5. Complete JSON is ready for AlphaFold 3

### Other Molecules as Ligand
1. Add protein sequence
2. Add ligand sequence
3. Add CCD codes or SMILES
   Note: only one ligand input method can exist in a JSON file
4. Define custom bondedAtomPairs if needed (optional)  
   Note 1: bondedAtomPairs is only available for CCDs  
   Note 2: when linking multiple CCDs into a larger molecule, it is recommended to define them within the same chain ID  
   Note 3: Atom names in each CCD are available from PDBeChem or RCSB PDB
5. Complete JSON is ready for AlphaFold 3

## Other Notes

- **Validation Required**: Always validate generated JSON before submission to AlphaFold 3
- **Sequence Limits**: Be aware of AlphaFold 3 sequence length limitations (around 5000 tokens)
- **Database Availability**: External database lookups depend on server availability
- **Privacy**: No data is sent to servers controlled by this project. When using glycan lookup features, the app makes direct client-side requests to third-party APIs (e.g., GlyGen, GlyTouCan). 

## Acknowledgments

This tool builds upon excellent work from the scientific community and open-source projects:

### Software & Libraries
- **SugarDrawer**: The Noguchi Institute (Apache-2.0)
  - License: https://www.apache.org/licenses/LICENSE-2.0
  - GitLab: https://gitlab.com/glycoinfo/sugardrawer

- **SugarSketcher**: The Noguchi Institute (Apache-2.0)
  - License: https://www.apache.org/licenses/LICENSE-2.0
  - GitLab: https://gitlab.com/glycoinfo/sugardrawer/SugarSketcher2.git

- **Bootstrap 5**: Frontend framework (MIT)
  - License: https://github.com/twbs/bootstrap/blob/main/LICENSE
- **Font Awesome**: Icon library (Font Awesome Free License)
  - License: https://fontawesome.com/license/free

### Used Databases
- **[UniProt](https://www.uniprot.org/)**
- **[GlyGen](https://www.glygen.org/)**
- **[GlyTouCan](https://glytoucan.org/)**
- **[RCSB PDB](https://www.rcsb.org/)**
- **[PDBeChem](https://www.ebi.ac.uk/pdbe-srv/pdbechem/)**

## Funding
This project is supported by:
- U.S. National Science Foundation BioFoundry: Glycoscience Research, Education and Training
- University of Georgia

## License

This project is licensed under the Apache License, Version 2.0. See `LICENSE` for details.

## Citation

If you use JAAG in your research, please cite:
- **JAAG**: 
```
@article{Huang2025,
  author  = {Huang, Chin and Moremen, Kelley W.},
  journal = {TBD},
  title   = {JAAG: a JSON input file Assembler for AlphaFold 3 with Glycan integration},
  year    = {2025},
  volume  = {TBD},
  doi     = {TBD}
}

```
- **AlphaFold 3**: 
```
@article{Abramson2024,
  author  = {Abramson, Josh and Adler, Jonas and Dunger, Jack and Evans, Richard and Green, Tim and Pritzel, Alexander and Ronneberger, Olaf and Willmore, Lindsay and Ballard, Andrew J. and Bambrick, Joshua and Bodenstein, Sebastian W. and Evans, David A. and Hung, Chia-Chun and O’Neill, Michael and Reiman, David and Tunyasuvunakool, Kathryn and Wu, Zachary and Žemgulytė, Akvilė and Arvaniti, Eirini and Beattie, Charles and Bertolli, Ottavia and Bridgland, Alex and Cherepanov, Alexey and Congreve, Miles and Cowen-Rivers, Alexander I. and Cowie, Andrew and Figurnov, Michael and Fuchs, Fabian B. and Gladman, Hannah and Jain, Rishub and Khan, Yousuf A. and Low, Caroline M. R. and Perlin, Kuba and Potapenko, Anna and Savy, Pascal and Singh, Sukhdeep and Stecula, Adrian and Thillaisundaram, Ashok and Tong, Catherine and Yakneen, Sergei and Zhong, Ellen D. and Zielinski, Michal and Žídek, Augustin and Bapst, Victor and Kohli, Pushmeet and Jaderberg, Max and Hassabis, Demis and Jumper, John M.},
  journal = {Nature},
  title   = {Accurate structure prediction of biomolecular interactions with AlphaFold 3},
  year    = {2024},
  volume  = {630},
  number  = {8016},
  pages   = {493–500},
  doi     = {10.1038/s41586-024-07487-w}
}
```
