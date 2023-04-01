import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { Heading, HStack, Image, Text, VStack, Icon } from 'native-base';

import { Entypo } from '@expo/vector-icons';

import { ExercisesDTO } from '@dtos/ExercisesDTO';

import { api } from '@services/api';


type ExerciseCardProps = TouchableOpacityProps & {
  exercises: ExercisesDTO
}

export function ExerciseCard({ exercises, ...rest }: ExerciseCardProps) {
  return (
    <TouchableOpacity {...rest}>

      <HStack bg="gray.500" alignItems="center" p={2} pr={4} rounded="md" mb={3} >
        <Image 
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${exercises.thumb}`,
          }}
          alt="Image do exercise"
          w={16}
          h={16}
          rounded="md"
          mr={4}
          resizeMode="cover"
        />
        <VStack flex={1} >
          <Heading fontSize="lg" color="white" fontFamily="heading">
            {exercises.name}
          </Heading>
          <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
            {exercises.series} series X {exercises.repetitions} repetição
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-thin-right"  color="gray.300" />
      </HStack>
      

    </TouchableOpacity>
  );
}