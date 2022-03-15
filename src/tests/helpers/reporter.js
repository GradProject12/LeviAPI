
  const {DisplayProcessor,
    SpecReporter,
    StacktraceOption} = require('jasmine-spec-reporter')
  const SuiteInfo = require('jasmine').SuiteInfo;
  
  class CustomProcessor extends DisplayProcessor {
     displayJasmineStarted(info, log) {
      return `${log}`;
    }
  }
  
  jasmine.getEnv().clearReporters();
  jasmine.getEnv().addReporter(
    new SpecReporter({
      spec: {
        displayStacktrace: StacktraceOption.NONE,
      },
      customProcessors: [CustomProcessor],
    })
  );
  