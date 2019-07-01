class Path {
  basepath(path) {
    return path
      .split('/')
      .pop()
      .split('\\')
      .pop();
  }
}

export default new Path();
