import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

interface ButtonProps extends IButtonProps {
  title: string;
  type?: "primary" | "secondary";
}

export function Button({ title, type = "primary", ...rest }: ButtonProps) {
  const propsButton = {
    bgColor: {
      primary: "yellow.500",
      secondary: "red.500",
    },
    pressed: {
      primary: "yellow.600",
      secondary: "red.600",
    },
    colorText: {
      primary: "black",
      secondary: "white",
    },
  };

  return (
    <ButtonNativeBase
      w="full"
      h="14"
      rounded="sm"
      fontSize="md"
      textTransform="uppercase"
      bg={propsButton.bgColor[type]}
      _pressed={{
        bg: propsButton.pressed[type],
      }}
      _loading={{
        _spinner: { color: "black" },
      }}
      {...rest}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        color={propsButton.colorText[type]}
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
