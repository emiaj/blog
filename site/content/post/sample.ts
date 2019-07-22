

class TypedBuilder<T> {
  constructor(private current = {}) {
  }
  prop<P extends keyof T, V extends T[P]>(key: P, value: V) {
    return new TypedBuilder<T>({ ...this.current, ...{ key: value } });
  }
  build() {
    return <T>this.current;
  }
}

// Usage

interface RequestSettings {
  protocol: 'http' | 'https';
  host: string;
  path: string;
  query?: string;
  headers: { key: string, value: string }[]
}

const settings2 = new TypedBuilder<RequestSettings>()
  .prop('protocol', 'http')
  .prop('host', 'test.com')
  .prop('path', '/foo/bar')
  .prop('headers', [])
  .build();



class AdvanceBuilder<T, R extends {} = {}> {

  constructor(private current: R = null) {
  }

  // P: Only those properties from T that do not exist in R
  prop<P extends Exclude<keyof T, keyof R>, V extends T[P]>(key: P, value: V) {

    let extra = { [key]: value };

    // `instance` is an intersection between our accumulator type (R) and
    // the `extra` object created above 
    let instance = {
      ...(this.current as object),
      ...(extra as object)
    } as R & Pick<T, P>;

    return new AdvanceBuilder<T, R & Pick<T, P>>(instance);
  }

  build(): R {
    return this.current;
  }
}











