// Load Glycan Templates from CSV Data
// This file contains the 12 glycan templates from your Excel file

const GLYCAN_TEMPLATE_DATA = [
    {
        name: "A2 (biantennary complex-type GlcNAc-terminal)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:b-dglc-HEX-1:5
3b:b-dman-HEX-1:5
4b:a-dman-HEX-1:5
5b:b-dglc-HEX-1:5
6b:a-dman-HEX-1:5
7b:b-dglc-HEX-1:5
8s:n-acetyl
9s:n-acetyl
10s:n-acetyl
11s:n-acetyl
LIN
1:1o(4+1)2d
2:2o(4+1)3d
3:3o(6+1)4d
4:4o(2+1)5d
5:3o(3+1)6d
6:6o(2+1)7d
7:1d(2+1)8n
8:2d(2+1)9n
9:5d(2+1)10n
10:7d(2+1)11n`
    },
    {
        name: "A2F (biantennary complex-type GlcNAc-terminal core-Fuc)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:a-lgal-HEX-1:5|6:d
3b:b-dglc-HEX-1:5
4b:b-dman-HEX-1:5
5b:a-dman-HEX-1:5
6b:b-dglc-HEX-1:5
7b:a-dman-HEX-1:5
8b:b-dglc-HEX-1:5
9s:n-acetyl
10s:n-acetyl
11s:n-acetyl
12s:n-acetyl
LIN
1:1o(6+1)2d
2:1o(4+1)3d
3:3o(4+1)4d
4:4o(6+1)5d
5:5o(2+1)6d
6:4o(3+1)7d
7:7o(2+1)8d
8:1d(2+1)9n
9:3d(2+1)10n
10:6d(2+1)11n
11:8d(2+1)12n`
    },
    {
        name: "G2 (biantennary complex-type Gal-terminal)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:b-dglc-HEX-1:5
3b:b-dman-HEX-1:5
4b:a-dman-HEX-1:5
5b:b-dglc-HEX-1:5
6b:b-dgal-HEX-1:5
7b:a-dman-HEX-1:5
8b:b-dglc-HEX-1:5
9b:b-dgal-HEX-1:5
10s:n-acetyl
11s:n-acetyl
12s:n-acetyl
13s:n-acetyl
LIN
1:1o(4+1)2d
2:2o(4+1)3d
3:3o(6+1)4d
4:4o(2+1)5d
5:5o(4+1)6d
6:3o(3+1)7d
7:7o(2+1)8d
8:8o(4+1)9d
9:1d(2+1)10n
10:2d(2+1)11n
11:5d(2+1)12n
12:8d(2+1)13n`
    },
    {
        name: "G2F (biantennary complex-type Gal-terminal core-Fuc)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:a-lgal-HEX-1:5|6:d
3b:b-dglc-HEX-1:5
4b:b-dman-HEX-1:5
5b:a-dman-HEX-1:5
6b:b-dglc-HEX-1:5
7b:b-dgal-HEX-1:5
8b:a-dman-HEX-1:5
9b:b-dglc-HEX-1:5
10b:b-dgal-HEX-1:5
11s:n-acetyl
12s:n-acetyl
13s:n-acetyl
14s:n-acetyl
LIN
1:1o(6+1)2d
2:1o(4+1)3d
3:3o(4+1)4d
4:4o(6+1)5d
5:5o(2+1)6d
6:6o(4+1)7d
7:4o(3+1)8d
8:8o(2+1)9d
9:9o(4+1)10d
10:1d(2+1)11n
11:3d(2+1)12n
12:6d(2+1)13n
13:9d(2+1)14n`
    },
    {
        name: "G2S2(α2,6) (biantennary complex-type α2,6-Sia)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:b-dglc-HEX-1:5
3b:b-dman-HEX-1:5
4b:a-dman-HEX-1:5
5b:b-dglc-HEX-1:5
6b:b-dgal-HEX-1:5
7b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
8b:a-dman-HEX-1:5
9b:b-dglc-HEX-1:5
10b:b-dgal-HEX-1:5
11b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
12s:n-acetyl
13s:n-acetyl
14s:n-acetyl
15s:n-acetyl
16s:n-acetyl
17s:n-acetyl
LIN
1:1o(4+1)2d
2:2o(4+1)3d
3:3o(6+1)4d
4:4o(2+1)5d
5:5o(4+1)6d
6:6o(6+2)7d
7:3o(3+1)8d
8:8o(2+1)9d
9:9o(4+1)10d
10:10o(6+2)11d
11:1d(2+1)12n
12:2d(2+1)13n
13:5d(2+1)14n
14:7d(5+1)15n
15:9d(2+1)16n
16:11d(5+1)17n`
    },
    {
        name: "G2S2(α2,6)F (biantennary complex-type α2,6-Sia core-Fuc)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:a-lgal-HEX-1:5|6:d
3b:b-dglc-HEX-1:5
4b:b-dman-HEX-1:5
5b:a-dman-HEX-1:5
6b:b-dglc-HEX-1:5
7b:b-dgal-HEX-1:5
8b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
9b:a-dman-HEX-1:5
10b:b-dglc-HEX-1:5
11b:b-dgal-HEX-1:5
12b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
13s:n-acetyl
14s:n-acetyl
15s:n-acetyl
16s:n-acetyl
17s:n-acetyl
18s:n-acetyl
LIN
1:1o(6+1)2d
2:1o(4+1)3d
3:3o(4+1)4d
4:4o(6+1)5d
5:5o(2+1)6d
6:6o(4+1)7d
7:7o(6+2)8d
8:4o(3+1)9d
9:9o(2+1)10d
10:10o(4+1)11d
11:11o(6+2)12d
12:1d(2+1)13n
13:3d(2+1)14n
14:6d(2+1)15n
15:8d(5+1)16n
16:10d(2+1)17n
17:12d(5+1)18n`
    },
    {
        name: "G2S2(α2,3) (biantennary complex-type α2,3-Sia)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:b-dglc-HEX-1:5
3b:b-dman-HEX-1:5
4b:a-dman-HEX-1:5
5b:b-dglc-HEX-1:5
6b:b-dgal-HEX-1:5
7b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
8b:a-dman-HEX-1:5
9b:b-dglc-HEX-1:5
10b:b-dgal-HEX-1:5
11b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
12s:n-acetyl
13s:n-acetyl
14s:n-acetyl
15s:n-acetyl
16s:n-acetyl
17s:n-acetyl
LIN
1:1o(4+1)2d
2:2o(4+1)3d
3:3o(6+1)4d
4:4o(2+1)5d
5:5o(4+1)6d
6:6o(3+2)7d
7:3o(3+1)8d
8:8o(2+1)9d
9:9o(4+1)10d
10:10o(3+2)11d
11:1d(2+1)12n
12:2d(2+1)13n
13:5d(2+1)14n
14:7d(5+1)15n
15:9d(2+1)16n
16:11d(5+1)17n`
    },
    {
        name: "G2S2(α2,3)F (biantennary complex-type α2,3-Sia core-Fuc)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:a-lgal-HEX-1:5|6:d
3b:b-dglc-HEX-1:5
4b:b-dman-HEX-1:5
5b:a-dman-HEX-1:5
6b:b-dglc-HEX-1:5
7b:b-dgal-HEX-1:5
8b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
9b:a-dman-HEX-1:5
10b:b-dglc-HEX-1:5
11b:b-dgal-HEX-1:5
12b:a-dgro-dgal-NON-2:6|1:a|2:keto|3:d
13s:n-acetyl
14s:n-acetyl
15s:n-acetyl
16s:n-acetyl
17s:n-acetyl
18s:n-acetyl
LIN
1:1o(6+1)2d
2:1o(4+1)3d
3:3o(4+1)4d
4:4o(6+1)5d
5:5o(2+1)6d
6:6o(4+1)7d
7:7o(3+2)8d
8:4o(3+1)9d
9:9o(2+1)10d
10:10o(4+1)11d
11:11o(3+2)12d
12:1d(2+1)13n
13:3d(2+1)14n
14:6d(2+1)15n
15:8d(5+1)16n
16:10d(2+1)17n
17:12d(5+1)18n`
    },
    {
        name: "M3 (high-mannose type)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:b-dglc-HEX-1:5
3b:b-dman-HEX-1:5
4b:a-dman-HEX-1:5
5b:a-dman-HEX-1:5
6s:n-acetyl
7s:n-acetyl
LIN
1:1o(4+1)2d
2:2o(4+1)3d
3:3o(6+1)4d
4:3o(3+1)5d
5:1d(2+1)6n
6:2d(2+1)7n`
    },
    {
        name: "M3F (high-mannose type core-Fuc)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:a-lgal-HEX-1:5|6:d
3b:b-dglc-HEX-1:5
4b:b-dman-HEX-1:5
5b:a-dman-HEX-1:5
6b:a-dman-HEX-1:5
7s:n-acetyl
8s:n-acetyl
LIN
1:1o(6+1)2d
2:1o(4+1)3d
3:3o(4+1)4d
4:4o(6+1)5d
5:4o(3+1)6d
6:1d(2+1)7n
7:3d(2+1)8n`
    },
    {
        name: "M5 (high-mannose type)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:b-dglc-HEX-1:5
3b:b-dman-HEX-1:5
4b:a-dman-HEX-1:5
5b:a-dman-HEX-1:5
6b:a-dman-HEX-1:5
7b:a-dman-HEX-1:5
8s:n-acetyl
9s:n-acetyl
LIN
1:1o(4+1)2d
2:2o(4+1)3d
3:3o(6+1)4d
4:4o(6+1)5d
5:4o(3+1)6d
6:3o(3+1)7d
7:1d(2+1)8n
8:2d(2+1)9n`
    },
    {
        name: "M5F (high-mannose type core-Fuc)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:a-lgal-HEX-1:5|6:d
3b:b-dglc-HEX-1:5
4b:b-dman-HEX-1:5
5b:a-dman-HEX-1:5
6b:a-dman-HEX-1:5
7b:a-dman-HEX-1:5
8b:a-dman-HEX-1:5
9s:n-acetyl
10s:n-acetyl
LIN
1:1o(6+1)2d
2:1o(4+1)3d
3:3o(4+1)4d
4:4o(6+1)5d
5:5o(6+1)6d
6:5o(3+1)7d
7:4o(3+1)8d
8:1d(2+1)9n
9:3d(2+1)10n`
    },
    {
        name: "M9 (high-mannose type)",
        glycoct: `RES
1b:b-dglc-HEX-1:5
2b:b-dglc-HEX-1:5
3b:b-dman-HEX-1:5
4b:a-dman-HEX-1:5
5b:a-dman-HEX-1:5
6b:a-dman-HEX-1:5
7b:a-dman-HEX-1:5
8b:a-dman-HEX-1:5
9b:a-dman-HEX-1:5
10b:a-dman-HEX-1:5
11b:a-dman-HEX-1:5
12s:n-acetyl
13s:n-acetyl
LIN
1:1o(4+1)2d
2:2o(4+1)3d
3:3o(6+1)4d
4:4o(6+1)5d
5:5o(2+1)6d
6:4o(3+1)7d
7:7o(2+1)8d
8:3o(3+1)9d
9:9o(2+1)10d
10:10o(2+1)11d
11:1d(2+1)12n
12:2d(2+1)13n`
    }
];

// Auto-load the template data when this script loads
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure glycan template manager is initialized
    setTimeout(() => {
        if (window.loadGlycanTemplateData) {
            window.loadGlycanTemplateData(GLYCAN_TEMPLATE_DATA);
        } else {
            setTimeout(() => {
                if (window.loadGlycanTemplateData) {
                    window.loadGlycanTemplateData(GLYCAN_TEMPLATE_DATA);
                }
            }, 1000);
        }
    }, 500);
});

