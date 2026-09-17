export function Artwork() {
  return (
    <div className="cloud-scene" aria-hidden="true">
      <svg
        viewBox="0 0 2450 720"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        <g transform="scale(1.75 1)">
          <g className="cloud-layer cloud-far" fill="#86c8e3">
            <path d="M-170 340C-126 210-3 178 92 252C126 91 321 69 391 225C463 134 583 156 631 270C730 139 918 137 1008 262C1073 90 1280 75 1351 236C1435 178 1530 220 1570 334V760H-170Z" />
          </g>
          <g className="cloud-layer cloud-middle" fill="#c9e8f6">
            <path d="M-160 418C-113 276 35 262 124 354C181 205 364 194 437 342C516 245 665 257 726 385C800 228 998 224 1082 366C1165 228 1372 233 1442 384C1504 341 1564 364 1592 421V760H-160Z" />
          </g>
        </g>

        <g className="hero-focal" transform="translate(1040 72) scale(.74)">
        <g className="hero-orbit" strokeLinecap="round" strokeWidth="12">
          <path d="M770 330C823 196 961 126 1105 148C1205 163 1288 220 1338 300" stroke="#5633a7" strokeDasharray="35 27" />
          <path d="M797 354C848 240 965 184 1086 200C1173 211 1245 259 1289 326" stroke="#8458d6" strokeDasharray="29 24" />
          <path d="M831 374C876 286 967 245 1063 257C1130 266 1190 301 1225 349" stroke="#f06aa6" strokeDasharray="25 22" />
        </g>

        <g className="hero-notebook">
          <path d="M1008 219L1187 252L1149 459L967 426Z" fill="#5633a7" opacity=".18" />
          <path d="M987 202L1167 235L1129 442L947 409Z" fill="#fffdf5" stroke="#5633a7" strokeWidth="5" />
          <path d="M1016 260L1110 277M1009 292L1087 306M991 365L1088 382M984 396L1054 409" stroke="#5633a7" strokeWidth="5" strokeLinecap="round" />
          <path d="M1021 329L1002 339L1016 356M1076 340L1090 356L1071 365M1055 326L1036 369" stroke="#8458d6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1153 386L1218 216L1240 224L1176 394L1153 418Z" fill="#f4ce54" stroke="#5633a7" strokeWidth="5" />
          <path d="M1153 418L1158 387L1176 394Z" fill="#fffdf5" stroke="#5633a7" strokeWidth="4" />
          <path d="M1224 204L1246 212L1240 228L1218 220Z" fill="#f06aa6" stroke="#5633a7" strokeWidth="4" />
        </g>

        <g className="hero-sparks" fill="#f4ce54">
          <path d="M905 181L914 153L923 181L951 190L923 199L914 227L905 199L877 190Z" />
          <circle cx="1272" cy="401" r="8" />
          <circle cx="864" cy="406" r="6" fill="#5633a7" />
        </g>
        </g>

        <g transform="scale(1.75 1)">
          <path
            className="cloud-foreground"
            d="M-170 420C-58 313 84 292 191 361C275 415 319 519 429 548C552 581 650 488 755 474C867 459 913 540 1007 508C1099 476 1124 359 1223 308C1322 257 1463 270 1570 321V760H-170Z"
            fill="#fdf8ed"
          />
        </g>
      </svg>
    </div>
  );
}

export function ArticleArtwork() {
  return (
    <div className="article-cloud-scene" aria-hidden="true">
      <svg
        viewBox="0 0 2450 720"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        <g transform="scale(1.75 1)">
          <g className="cloud-layer cloud-far" fill="#86c8e3">
            <path d="M-170 340C-126 210-3 178 92 252C126 91 321 69 391 225C463 134 583 156 631 270C730 139 918 137 1008 262C1073 90 1280 75 1351 236C1435 178 1530 220 1570 334V760H-170Z" />
          </g>
          <g className="cloud-layer cloud-middle" fill="#c9e8f6">
            <path d="M-160 418C-113 276 35 262 124 354C181 205 364 194 437 342C516 245 665 257 726 385C800 228 998 224 1082 366C1165 228 1372 233 1442 384C1504 341 1564 364 1592 421V760H-160Z" />
          </g>
        </g>
        <g transform="scale(1.75 1)">
          <path
            className="cloud-foreground"
            d="M-170 420C-58 313 84 292 191 361C275 415 319 519 429 548C552 581 650 488 755 474C867 459 913 540 1007 508C1099 476 1124 359 1223 308C1322 257 1463 270 1570 321V760H-170Z"
            fill="#fdf8ed"
          />
        </g>
      </svg>
    </div>
  );
}

export function FooterArtwork() {
  return (
    <div className="footer-artwork" aria-hidden="true">
      <svg
        className="footer-landscape"
        viewBox="0 0 1600 640"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          className="footer-cloud footer-cloud-far"
          d="M0 138C123 69 229 61 342 122C475 194 558 159 663 98C790 24 902 63 1001 116C1107 172 1186 139 1262 82C1366 4 1499 39 1600 135V640H0Z"
          fill="#86c8e3"
        />
        <path
          className="footer-sky"
          d="M0 106C119 51 235 96 356 136C487 179 577 76 709 68C845 60 893 143 1019 139C1145 135 1202 50 1294 76C1412 109 1348 232 1444 214C1510 202 1548 130 1600 105V640H0Z"
          fill="#a9d9ed"
        />
        <path
          className="footer-cloud footer-cloud-mid"
          d="M-160 640C-116 456 52 365 206 438C331 497 374 622 512 640H-160ZM866 640C947 514 1068 444 1193 477C1327 512 1357 604 1458 577C1510 563 1564 513 1640 486V640H866Z"
          fill="#86c8e3"
        />
        <path
          className="footer-cloud footer-cloud-near"
          d="M-120 640C-46 548 56 517 153 556C225 585 267 628 339 640H-120ZM567 640C652 548 778 523 881 573C932 598 975 627 1029 640H567ZM1305 640C1392 555 1510 535 1640 602V640H1305Z"
          fill="#c9e8f6"
        />
      </svg>
      <svg
        className="footer-focal-art"
        viewBox="0 0 520 300"
        fill="none"
      >
        <g className="footer-focal" transform="translate(-650 -20) scale(.72)">
          <g className="footer-orbit" strokeLinecap="round" strokeWidth="7">
            <path d="M816 193C853 102 949 61 1045 81C1104 93 1152 126 1177 168" stroke="#5633a7" strokeDasharray="22 18" />
            <path d="M838 208C872 136 949 105 1026 120C1072 129 1111 153 1133 184" stroke="#f06aa6" strokeDasharray="18 15" />
          </g>

          <g className="footer-notebook">
            <path d="M930 111L1040 132L1018 251L906 230Z" fill="#5633a7" opacity=".18" />
            <path d="M918 100L1028 121L1006 240L894 219Z" fill="#fffdf5" stroke="#5633a7" strokeWidth="4" />
            <path d="M936 139L991 149M931 158L978 167M920 198L977 208" stroke="#5633a7" strokeWidth="4" strokeLinecap="round" />
            <path d="M1021 211L1059 112L1073 117L1035 216L1021 231Z" fill="#f4ce54" stroke="#5633a7" strokeWidth="4" />
            <path d="M1063 105L1077 110L1073 120L1059 115Z" fill="#f06aa6" stroke="#5633a7" strokeWidth="3" />
          </g>

          <path d="M1091 75L1098 54L1105 75L1126 82L1105 89L1098 110L1091 89L1070 82Z" fill="#f4ce54" />
        </g>
      </svg>
    </div>
  );
}
