import { Theme } from "gosling.js";

// gosling themes
// export const darkThemeColors = ['#E79F00', '#029F73', '#0072B2', '#CB7AA7', '#D45E00', '#57B4E9', '#EFE441' /*'#000000'*/];
// export const ensemblThemeColors = ['#CD9B1D', '#8A668B', '#40E0D0', '#FF6969', '#666666', '#FAC902', '#FE0000', '#CC96CD', '#D9D9D9' /*'#000000'*/];
// export const excelThemeColors = ['#ED7D31', '#4472C4', '#FFC207', '#76AE4F', '#9E480E', '#A5A5A5', '#4472C4', '#264378', '#76AE4F', '#5B9CD5' /*'#000000'*/];
// export const ggplotThemeColors = ['#F66A62', '#05B230', '#5692FF', '#D764D6', '#86E9D4', '#6E6AD7', '#FFFB00'];
// export const googleThemeColors = ['#4185f4', '#DB4437', '#F4B400', '#0D9D58', '#AA30C3', '#FF6E02', '#CBC74C' /*'#000000'*/];
// export const igvThemeColors = ['#37E649', '#ED2D44', '#AEAFEA', '#EBAEAE', '#CE7B3D', '#8743E0', '#5233F0'];
// export const jbrowseThemeColors = ['#3A62FE', '#F85353', '#3A62FE', '#F85353', '#DCA326', '#03BF06', '#BABABA' /*'#000000'*/];
// export const lightThemeColors = ['#E79F00', '#029F73', '#0072B2', '#CB7AA7', '#D45E00', '#57B4E9', '#EFE441' /*'#000000'*/];
// export const uscsThemeColors = ['#3A5FCD', '#FFA54E', '#8FBC8F', '#B6709B', '#EE6A50', '#CCB79E', '#DADA8F', '#00CDCC', '#EED5D2', '#CD8EDD', '#9ACD31', '#D1BEA8', '#FFB6C0' /*'#000000'*/];
// export const warmThemeColors = ['#D19000', '#008F67', '#005F96', '#B86E97', '#B55100', '#4793BF', '#C9C03'];
// export const washuThemeColors = ['#6E12AC', '#15C250', '#E70FB1', '#FF8E55', '#A3B8F3', '#DE5E59', '#77AAAA', '#F5CCCA' /*'#000000'*/];

type ThemeType = "light" | "dark" | "warm" | "ggplot" | "igv" | "ensembl" | "jbrowse" | "ucsc" | "washu" | "excel" | "google";

const goslingThemeColors = {
    'dark': ['#E79F00', '#029F73', '#0072B2', '#CB7AA7', '#D45E00', '#57B4E9', '#EFE441' /*'#000000'*/],
    'ensembl': ['#CD9B1D', '#8A668B', '#40E0D0', '#FF6969', '#666666', '#FAC902', '#FE0000', '#CC96CD', '#D9D9D9' /*'#000000'*/],
    'excel': ['#ED7D31', '#4472C4', '#FFC207', '#76AE4F', '#9E480E', '#A5A5A5', '#4472C4', '#264378', '#76AE4F', '#5B9CD5' /*'#000000'*/],
    'ggplot': ['#F66A62', '#05B230', '#5692FF', '#D764D6', '#86E9D4', '#6E6AD7', '#FFFB00'],
    'google': ['#4185f4', '#DB4437', '#F4B400', '#0D9D58', '#AA30C3', '#FF6E02', '#CBC74C' /*'#000000'*/],
    'igv':['#37E649', '#ED2D44', '#AEAFEA', '#EBAEAE', '#CE7B3D', '#8743E0', '#5233F0'],
    'jbrowse':['#3A62FE', '#F85353', '#3A62FE', '#F85353', '#DCA326', '#03BF06', '#BABABA' /*'#000000'*/],
    'light':  ['#E79F00', '#029F73', '#0072B2', '#CB7AA7', '#D45E00', '#57B4E9', '#EFE441' /*'#000000'*/],
    'ucsc': ['#3A5FCD', '#FFA54E', '#8FBC8F', '#B6709B', '#EE6A50', '#CCB79E', '#DADA8F', '#00CDCC', '#EED5D2', '#CD8EDD', '#9ACD31', '#D1BEA8', '#FFB6C0' /*'#000000'*/],
    'warm': ['#D19000', '#008F67', '#005F96', '#B86E97', '#B55100', '#4793BF', '#C9C03'],
    'washu': ['#6E12AC', '#15C250', '#E70FB1', '#FF8E55', '#A3B8F3', '#DE5E59', '#77AAAA', '#F5CCCA' /*'#000000'*/]
}

// Schema guard for checking if Theme is ThemeType or ThemeDeep
export function IsThemeType(t: Theme): t is ThemeType {
    return !('base' in Object.keys(t));
}

// Given a theme, return the nominal colors of this theme
// Default: 'light' theme
export function getThemeColors(theme?: Theme) {
    if (theme) {
        let themeType;
        if (IsThemeType(theme)) {
            themeType = theme;
        } else {
            themeType = theme.base;
        }
        themeType = themeType as ThemeType;
        return goslingThemeColors[themeType];
    }
    else {
        return goslingThemeColors['light'];
    }
}
