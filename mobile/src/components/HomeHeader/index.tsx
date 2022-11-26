import { UserPhoto } from "@components/UserPhoto";
import { MaterialIcons } from '@expo/vector-icons';


import { Heading, HStack, Icon, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";


export function HomeHeader() {
  return (
    <HStack 
      bg="gray.600" 
      pt={16} pb={5} 
      px={8} 
      alignItems="center" 
    >
      <UserPhoto 
        source={{ uri: "https://avatars.githubusercontent.com/u/97991895?v=4" }}
        size={16}
        alt="Imagem do usuário"
        mr={4}
      />
      <VStack flex={1} >
        <Text color="gray.100" fontSize="md" >
          olá,  
        </Text>
        <Heading color="gray.100"  fontSize="md" fontFamily="heading">
          João Alberto
        </Heading>
      </VStack>
      <TouchableOpacity>        
        <Icon 
          as={MaterialIcons}
          name="logout" color="gray.200" size={7}
        />
      </TouchableOpacity>
    </HStack>
  )
}