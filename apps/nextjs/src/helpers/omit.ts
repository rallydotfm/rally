import omitDeep from 'omit-deep'

const omit = (object: any, name: any) => {
  return omitDeep(object, name)
}

export default omit
