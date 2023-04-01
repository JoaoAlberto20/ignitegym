import { Heading, HStack, Icon, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";

import { UserPhoto } from "@components/UserPhoto";
import { MaterialIcons } from '@expo/vector-icons';

import userPhotoDefaultImg from '@assets/userPhotoDefault.png';

import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";

export function HomeHeader() {
  const { user, signOut} = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const URL_PHOTO = `${api.defaults.baseURL}/avatar/${user.avatar}`
 
  return (
    <HStack 
      bg="gray.600" 
      pt={16} pb={5} 
      px={8} 
      alignItems="center" 
    >
      <UserPhoto 
        source={ user.avatar ? { uri: URL_PHOTO  } : userPhotoDefaultImg }
        size={16}
        alt="Imagem do usuário"
        mr={4}
      />
      <VStack flex={1} >
        <Text color="gray.100" fontSize="md" >
          olá,  
        </Text>
        <Heading color="gray.100"  fontSize="md" fontFamily="heading">
         {user.name}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={handleSignOut}>        
        <Icon 
          as={MaterialIcons}
          name="logout" color="gray.200" size={7}
        />
      </TouchableOpacity>
    </HStack>
  )
}