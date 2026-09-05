import SearchIcon from
  "@mui/icons-material/Search";

import {
  InputBase,
} from "@mui/material";

import {
  alpha,
  styled,
} from "@mui/material/styles";

const Search =
  styled("div")(
    ({ theme }) => ({
      position:
        "relative",

      borderRadius:
        theme.shape
          .borderRadius,

      backgroundColor:
        alpha(
          theme.palette
            .common.white,
          0.15
        ),

      "&:hover": {
        backgroundColor:
          alpha(
            theme.palette
              .common.white,
            0.25
          ),
      },

      marginRight:
        theme.spacing(2),

      marginLeft: 0,

      width: "100%",

      [theme.breakpoints.up(
        "sm"
      )]: {
        marginLeft:
          theme.spacing(3),

        width: "auto",
      },
    })
  );

const SearchIconWrapper =
  styled("div")(
    ({ theme }) => ({
      padding:
        theme.spacing(
          0,
          2
        ),

      height: "100%",

      position:
        "absolute",

      pointerEvents:
        "none",

      display: "flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      color: "black",
    })
  );

const StyledInputBase =
  styled(InputBase)(
    ({ theme }) => ({
      color: "black",

      border:
        "1px solid #aaaaaa",

      borderRadius:
        "16px",

      minWidth: "300px",

      "& .MuiInputBase-input":
        {
          padding:
            theme.spacing(
              1,
              1,
              1,
              0
            ),

          paddingLeft:
            `calc(1em + ${theme.spacing(
              4
            )})`,

          transition:
            theme.transitions.create(
              "width"
            ),

          width: "100%",
        },
    })
  );

export function SearchBar({
  placeholder,
  setValue,
  value,
}) {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>

      <StyledInputBase
        placeholder={
          placeholder ??
          "Search..."
        }
        inputProps={{
          "aria-label":
            "search",
        }}
        onChange={(event) =>
          setValue?.(
            event.target
              .value
          )
        }
        value={value}
      />
    </Search>
  );
}
