# Overview
Tesseract.js offers 3 different ways to recognize text, which vary in complexity.  This allows Tesseract.js to provide ease of use to new users experimenting with Tesseract.js, while offering control and performance to more experienced users.  Each option is described in brief below, in order of complexity.  For more detailed documentation on each function, see the [api page](./api.md). 

# Option 1: Single Function
By using `Tesseract.recognize`, you can recognize text with just 1 function and 2 arguments (image and language).  This makes it easy for new users to experiment with Tesseract.js. 

```
Tesseract.recognize(
  'https://tesseract.projectnaptha.com/img/eng_bw.png',
  'eng'
).then(({ data: { text } }) => {
  console.log(text);
})
```

This option should generally be avoided in production code.  Using `Tesseract.recognize` results in a new worker being created and loaded with language data whenever `Tesseract.recognize` is run.  This is inefficient for reasons explained below.

# Option 2: Using Workers
Tesseract.js also supports creating and managing workers (the objects that execute recognition) manually. 

```
(async () => {
    const worker = await Tesseract.createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
    console.log(text);
    await worker.terminate();
})();
```

This code block is no more efficient than the `Tesseract.recognize` example as written (in both cases a worker is created and destroyed for recognizing a single image).  However, within the context of an actual application, separating (1) creating a worker and loading data and (2) running recognition jobs provides developers the control necessary to write more efficient code:
1.	Workers can be prepared ahead of time
    - E.g. a worker can be created and loaded with language data when the page is first loaded, rather than waiting for a user to upload an image to recognize
1.	Workers can be reused for multiple recognition jobs, rather than creating a new worker and loading language data for every image recognized (as `Tesseract.recognize` does)

# Option 3: Using Schedulers + Workers
Finally, Tesseract.js supports schedulers.  A scheduler is an object that contains multiple workers, which it uses to execute jobs in parallel.  
 
```
const scheduler = Tesseract.createScheduler();

// Creates worker and adds to scheduler
const workerGen = async () => {
  const worker = await Tesseract.createWorker();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  scheduler.addWorker(worker);
}

const workerN = 4;
(async () => {
  const resArr = Array(workerN);
  for (let i=0; i<workerN; i++) {
    resArr[i] = workerGen();
  }
  await Promise.all(resArr);
  /** Add 4 recognition jobs */
  const results = await Promise.all(Array(10).fill(0).map(() => (
    scheduler.addJob('recognize', 'https://tesseract.projectnaptha.com/img/eng_bw.png').then((x) => console.log(x.data.text))
  )))
  await scheduler.terminate(); // It also terminates all workers.
})();
```

While using schedulers is no more efficient for a single job, they allow for quickly executing large numbers of jobs in parallel. 

When working with schedulers, note that workers added to the same scheduler should all be homogenous—they should have the same language be configured with the same parameters.  Schedulers assign jobs to workers in a non-deterministic manner, so if the workers are not identical then recognition results will depend on which worker the job is assigned to. 
