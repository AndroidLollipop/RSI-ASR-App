// written by AndroidLollipop
// follows Callbag conventions, except this uses a trampoline:
// https://github.com/callbag/callbag
const typeStart = 0
const typeData = 1
const typeEnd = 2
const typeNFE = 1337
const typeIFE = 1338
const typeMIS = 1339
const cbtySuccess = 1340
const cbtyQueued = 1341
const cbtyFailure = 1342
const trampoline = func => {
  // we cannot use recursion in the trampoline because we want to avoid call stack overflows (which is why we have a trampoline in the first place)
  var buffer = [func]
  var res
  while (buffer.length > 0) {
    res = buffer.shift()
    while (typeof res === "function") {
      res = res()
    }
    if (typeof res === "object") {
      buffer.unshift(...res)
    }
  }
}
const forEachGen = (startPull, dataPull) => (func, misFunc, endFunc, adsFunc) => source => {
  var talkback
  return trampoline(source(typeStart, (type, data) => {
    if (type === typeStart) {
      talkback = data
      if (startPull) {
        return () => talkback(typeData)
      }
    }
    else if (type === typeData) {
      func(data)
      if (dataPull) {
        return () => talkback(typeData)
      }
    }
    else if (type === typeMIS && misFunc) {
      misFunc(data)
    }
    else if (type === typeEnd && endFunc) {
      endFunc(data)
    }
    else if (adsFunc) {
      adsFunc(type, data)
    }
  }))
}
const forEach = forEachGen(true, true)
const listen = forEachGen(false, false)
const pullOnce = forEachGen(true, false)
// only false, true left but no legitimate uses of that come to mind immediately
const start = forEach(()=>{})
const listenStart = listen(()=>{})
const pullStart = pullOnce(()=>{})
const factoryToCallback = (dataCallback, sourceTerminationCallback, startCallback) => {
  var talkToSource
  var terminatedByCallback = false
  return {
    callbag: source => {
      return trampoline(source(typeStart, (type, data) => {
        if (type === typeStart) {
          if (terminatedByCallback) {
            return () => data(typeEnd)
          }
          talkToSource = data
          if (startCallback) {
            return () => startCallback(talkToSource)
          }
        }
        else if (type === typeData) {
          if (terminatedByCallback) {
            const savedSourceTalkback = talkToSource
            talkToSource = undefined
            return () => savedSourceTalkback(typeEnd)
          }
          // yes, please supply a data callback. ()=>{} is fine.
          return () => dataCallback(data, talkToSource)
        }
        else if (type === typeEnd) {
          talkToSource = undefined
          if (sourceTerminationCallback) {
            return () => sourceTerminationCallback(data, talkToSource)
          }
        }
      }))
    },
    callback: data => {
      if (talkToSource) {
        trampoline(talkToSource(typeData, data))
        return cbtySuccess
      }
      return cbtyFailure
    },
    terminate: data => {
      terminatedByCallback = true
      if (talkToSource) {
        const savedSourceTalkback = talkToSource
        talkToSource = undefined
        trampoline(savedSourceTalkback(typeEnd, data))
        return cbtySuccess
      }
      return cbtyQueued
    }
  }
}
const factoryPullCallback = (dataCallback, sourceTerminationCallback) => factoryToCallback(dataCallback, sourceTerminationCallback, (talkToSource) => {
  return () => talkToSource(typeData)
})
const toPromiselikeGen = startPull => source => {
  var talkToSource
  var terminatedByCallback = false
  var received = false
  var resolvedData
  var talkToCallback
  var rejected = false
  var resolvedError
  var talkToError
  var talkToEnd
  trampoline(source(typeStart, (type, data) => {
    if (type === typeStart) {
      if (terminatedByCallback) {
        return () => data(typeEnd)
      }
      talkToSource = data
      if (startPull) {
        return () => talkToSource(typeData)
      }
    }
    else if (type === typeData) {
      received = true
      resolvedData = data
      const savedSourceTalkback = talkToSource
      talkToSource = undefined
      if (talkToCallback) {
        talkToCallback(data)
      }
      if (talkToEnd) {
        talkToEnd()
      }
      return () => savedSourceTalkback(typeEnd)
    }
    else if (type === typeEnd) {
      rejected = true
      resolvedError = data
      talkToSource = undefined
      if (talkToError) {
        talkToError(data)
      }
      if (talkToEnd) {
        talkToEnd()
      }
    }
  }))
  return { // only allows a single level of .callback (callbacks can only be set once). use toPromise to completely convert to promise.
    then: callback => {
      talkToCallback = callback
      if (received) {
        callback(resolvedData)
      }
    },
    catch: error => {
      talkToError = error
      if (rejected) {
        error(resolvedError)
      }
    },
    finally: end => {
      talkToEnd = end
      if (received || rejected) {
        end()
      }
    }
  }
}
const toPromiselike = toPromiselikeGen(false)
const toPromiselikePull = toPromiselikeGen(true)
const toPromiseGen = startPull => source => new Promise(
  (resolve, reject) => {
    const promiselike = toPromiselikeGen(startPull)(source)
    promiselike.then(resolve)
    promiselike.catch(reject)
  }
)
const toPromise = toPromiseGen(false)
const toPromisePull = toPromiseGen(true)
const map = (func, misFunc, endFunc, adsFunc) => source => (type, data) => {
  if (type === typeStart) {
    var sinkTalkback = data
    var sourceTalkback
    return () => source(typeStart, (type, innerData) => {
      if (type === typeStart) {
        sourceTalkback = innerData
        return () => sinkTalkback(typeStart, sourceTalkback)
      }
      else if (type === typeData) {
        return () => sinkTalkback(typeData, func(innerData))
      }
      else if (type === typeMIS) {
        return () => sinkTalkback(typeMIS, misFunc ? misFunc(innerData) : innerData)
      }
      else if (type === typeEnd) {
        return () => sinkTalkback(typeEnd, endFunc ? endFunc(innerData) : innerData)
      }
      else {
        return () => sinkTalkback(type, adsFunc ? adsFunc(type, innerData) : innerData)
      }
    })
  }
}
const mapFromFactories = (...args) => source => (type, data) => {
  if (type === typeStart) {
    var [func, misFunc, endFunc, adsFunc] = args.map(x => x ? x() : undefined) // x => x ? x() : x suffices but is less clear
    var sinkTalkback = data
    var sourceTalkback
    return () => source(typeStart, (type, innerData) => {
      if (type === typeStart) {
        sourceTalkback = innerData
        return () => sinkTalkback(typeStart, sourceTalkback)
      }
      else if (type === typeData) {
        return () => sinkTalkback(typeData, func(innerData))
      }
      else if (type === typeMIS) {
        return () => sinkTalkback(typeMIS, misFunc ? misFunc(innerData) : innerData)
      }
      else if (type === typeEnd) {
        return () => sinkTalkback(typeEnd, endFunc ? endFunc(innerData) : innerData)
      }
      else {
        return () => sinkTalkback(type, adsFunc ? adsFunc(type, innerData) : innerData)
      }
    })
  }
}
const filter = func => source => (type, data) => {
  if (type === typeStart) {
    var sinkTalkback = data
    var sourceTalkback
    return () => source(typeStart, (type, innerData) => {
      if (type === typeStart) {
        sourceTalkback = innerData
        return () => sinkTalkback(typeStart, sourceTalkback)
      }
      else if (type === typeData) {
        return func(innerData) ? () => sinkTalkback(typeData, innerData) : () => sourceTalkback(typeData)
      }
      else if (type === typeEnd) {
        // explicitly specify what happens when type is typeEnd rather than rely on the fallthrough.
        return () => sinkTalkback(typeEnd, innerData)
      }
      else {
        return () => sinkTalkback(type, innerData)
      }
    })
  }
}
const lastN = immutableCount => source => (type, data) => {
  // there is a cute way to implement this using mergeSources, but it would be rather hard to read
  // using fold to implement this would be dog slow.
  // no more tricks. immutableCount must be a positive integer. use take(0) if you want an instant rejection.
  if (type === typeStart) {
    var sinkTalkback = data
    var sourceTalkback
    var sourceHasTerminated = false
    var terminatedBySink = false
    var recorded = false
    var record = []
    // we can be cute and use a circular buffer for record.
    const talkToSource = (type, innerData) => {
      if (type === typeEnd) {
        terminatedBySink = true
      }
      if (sourceHasTerminated === true) {
        return
      }
      return () => sourceTalkback(type, innerData)
    }
    return () => source(typeStart, (type, innerData) => {
      if (type === typeStart) {
        sourceTalkback = innerData
        return () => sinkTalkback(typeStart, talkToSource)
      }
      else if (type === typeData) {
        recorded = true // we can't check if record is undefined to determine if we have recorded any data because data can be undefined
        if (immutableCount === 1) {
          // performance optimization for immutableCount === 1
          record = innerData
        }
        else {
          record.push(innerData)
        }
        return () => sourceTalkback(typeData)
      }
      else if (type === typeEnd) {
        sourceHasTerminated = true
        if (recorded) {
          if (immutableCount === 1) {
            return [() => sinkTalkback(typeData, record), () => terminatedBySink ? undefined : sinkTalkback(typeEnd, innerData)]
          }
          else {
            const sdx = record.length-immutableCount
            return [record.slice(sdx < 0 ? 0 : sdx, record.length).map(v => () => terminatedBySink ? undefined : sinkTalkback(typeData, v)), () => terminatedBySink ? undefined : sinkTalkback(typeEnd, innerData)]
          }
        }
        else {
          return () => sinkTalkback(typeEnd, innerData)
        }
      }
      else {
        return () => sinkTalkback(type, innerData)
      }
    })
  }
}
const last = lastN(1)
const take = immutableNumber => source => (type, data) => {
  if (type === typeStart) {
    var number = immutableNumber // for repeatability
    var sinkTalkback = data
    var sourceTalkback
    var inProgress = true
    // the purpose of inProgress is to prevent enders from being scheduled too many times
    var ended = false
    // the purpose of ended is to cancel the execution of the enders
    const endImmediately = number === 0
    const endCheckFunc = () => {
      if (inProgress) {
        inProgress = false
        return [() => ended ? undefined : sinkTalkback(typeEnd), () => ended ? undefined : sourceTalkback(typeEnd)]
      }
    }
    const talkToSource = (type, innerData) => {
      if (type === typeEnd) {
        inProgress = false
        ended = true
      }
      return () => sourceTalkback(type, innerData)
    }
    return () => source(typeStart, (type, innerData) => {
      if (type === typeStart) {
        sourceTalkback = innerData
        return endImmediately ? [() => sinkTalkback(typeStart, talkToSource), endCheckFunc] : () => sinkTalkback(typeStart, talkToSource)
      }
      else if (type === typeData) {
        if (number === 0) {
          // sadly we can't be sure if control flow will return here or fall through to endCheckFunc in the trampolined array so we have to do this
          return endCheckFunc
        }
        else {
          number--
          return number === 0 ? [() => sinkTalkback(typeData, innerData), endCheckFunc] : () => sinkTalkback(typeData, innerData)
          // send end immediately when number === 0 to avoid unnecessary delay if source is asynchronous (e.g. rangeInterval)
        }
      }
      else if (type === typeEnd) {
        // still better to explicitly state what happens on end rather than to rely on the catchall at the end
        inProgress = false
        ended = true
        return () => sinkTalkback(typeEnd, innerData)
      }
      else {
        return () => sinkTalkback(type, innerData)
        // alternate data streams are not governed by take
      }
    })
  }
}
const range = (immutableStart, nonInclusiveEnd) => (type, data) => {
  if (type === typeStart) {
    var start = immutableStart
    return () => data(typeStart, (type, innerData) => {
      if (type === typeData) {
        if (start === nonInclusiveEnd) {
          // permits infinite ranges by using a smaller end
          return () => data(typeEnd)
        }
        else {
          const dataPacket = start
          start++
          return () => data(typeData, dataPacket)
        }
      }
    })
  }
}
const factoryFromCallback = sinkTerminationCallback => {
  var talkToSink
  var terminatedByCallback = false
  return {
    callbag: (type, data) => {
      if (type === typeStart) {
        if (terminatedByCallback) {
          return [() => data(typeStart, (type, innerData) => {
            if (type === typeEnd) {
              data = undefined
              // the reason a termination flag rather than this is used in latest is for readability.
              // readability isn't a huge concern here.
            }
          }), () => data ? data(typeEnd) : undefined]
        }
        talkToSink = data
        return () => talkToSink(typeStart, (type, innerData) => {
          if (type === typeEnd) {
            talkToSink = undefined
            if (sinkTerminationCallback) {
              sinkTerminationCallback(innerData)
            }
          }
        })
      }
    },
    callback: data => {
      if (talkToSink) {
        trampoline(() => talkToSink(typeData, data))
        return cbtySuccess
      }
      else {
        return cbtyFailure
      }
    },
    terminate: data => {
      terminatedByCallback = true
      if (talkToSink) {
        const savedSinkTalkback = talkToSink
        talkToSink = undefined
        trampoline(() => savedSinkTalkback(typeEnd, data))
        return cbtySuccess
      }
      return cbtyQueued
    }
  }
}
const fromArray = (array, immutableStart, nonInclusiveEnd) => (type, data) => {
  if (type === typeStart) {
    var start = 0
    var end = array.length
    if (immutableStart) {
      start = immutableStart
    }
    if (nonInclusiveEnd) {
      end = nonInclusiveEnd
    }
    return () => data(typeStart, (type, innerData) => {
      if (type === typeData) {
        if (start === end) {
          // permits infinite ranges by using a smaller end
          return () => data(typeEnd)
        }
        else {
          const dataPacket = array[start]
          start++
          return () => data(typeData, dataPacket)
        }
      }
    })
  }
}
const rangeInterval = (immutableStart, nonInclusiveEnd, interval) => (type, data) => {
  if (type === typeStart) {
    var start = immutableStart
    const startTime = (new Date()).getTime()
    const endFunc = (selfTerminated) => () => {
      clearInterval(myInterval)
      if (selfTerminated) {
        return [() => data(typeMIS, (new Date()).getTime()-startTime), () => data(typeEnd)]
      }
    }
    const myInterval = setInterval(() => trampoline(() => {
      const dataPacket = start
      start++
      if (start === nonInclusiveEnd) {
        return [() => data(typeData, dataPacket), endFunc(true)]
      }
      return () => data(typeData, dataPacket)
    }), interval)
    return [data(typeStart, (type, data) => {
      if (type === typeEnd) {
        return endFunc(false)
      }
    }), start === nonInclusiveEnd ? endFunc(true) : undefined]
  }
}
const mergeSources = (...sources) => (type, data) => {
  if (type === typeStart) {
    var sinkTalkback = data
    var sourceTalkbacks = []
    var inProgress = false
    var ended = false
    var cancelledSourceTalkbacks = 0
    const talkToSources = (type, data) => {
      if (type === typeEnd) {
        ended = true
      }
      return () => sourceTalkbacks.map(talkback => talkback ? () => talkback(type, data) : undefined)
    }
    return () => sources.map(source => () => {
      var mySourceIndex
      return source(typeStart, (type, innerData) => {
        if (type === typeEnd) {
          cancelledSourceTalkbacks++
          sourceTalkbacks[mySourceIndex] = undefined
          if (cancelledSourceTalkbacks === sources.length && ended === false) {
            return () => sinkTalkback(typeEnd, innerData)
          }
        }
        else if (type === typeStart) {
          mySourceIndex = sourceTalkbacks.push(innerData)-1
          if (inProgress === false) {
            inProgress = true
            return () => sinkTalkback(typeStart, talkToSources)
          }
        }
        else if (ended === true) {
          return () => sourceTalkbacks[mySourceIndex](typeEnd)
        }
        else if (type === typeData && inProgress) {
          // explicitly state what happens to a message with type typeData rather than rely on the catchall at the end
          return () => sinkTalkback(typeData, innerData)
        }
        else if (inProgress) {
          return () => sinkTalkback(type, innerData)
        }
      }
    )})
  }
}
// splitSource can't be made evergreen by definition.
const splitSourceGen = (override, value) => source => {
  var sinkTalkbacks = []
  var sourceTalkback
  var inProgress = false
  var ended = false
  var started = false
  var cancelledSinkTalkbacks = 0
  const talkToSource = (sinkIndex) => (type, data) => {
    if (type === typeEnd) {
      sinkTalkbacks[sinkIndex] = undefined
      cancelledSinkTalkbacks++
      if (override ? cancelledSinkTalkbacks === value : cancelledSinkTalkbacks === sinkTalkbacks.length) {
        return () => sourceTalkback(typeEnd, data)
      }
    }
    else {
      return () => sourceTalkback(type, data)
    }
  }
  const talkToSinks = (type, data) => {
    if (type === typeStart) {
      started = true
      sourceTalkback = data
      return () => sinkTalkbacks.map((talkback, index) => talkback ? () => talkback(type, talkToSource(index)) : undefined)
    }
    else if (type === typeEnd) {
      ended = true
    }
    return () => sinkTalkbacks.map(talkback => talkback ? () => talkback(type, data) : undefined)
  }
  // the protocol isn't completely symmetric so we can't use mergeSources (we need to define an ordering)
  return (type, data) => {
    var mySinkIndex
    if (type === typeStart) {
      mySinkIndex = sinkTalkbacks.push(data)-1
      if (inProgress === false) {
        inProgress = true
        return () => source(typeStart, talkToSinks)
      }
      else if (ended === true) {
        var terminatedBySink = false
        return [() => sinkTalkbacks[mySinkIndex](typeStart, (type, data)=>{if(type === typeEnd){terminatedBySink = true}}), () => terminatedBySink ? undefined : sinkTalkbacks[mySinkIndex](typeEnd)]
      }
      else if (started === true) {
        return () => sinkTalkbacks[mySinkIndex](typeStart, talkToSource(mySinkIndex))
      }
    }
  }
}
const splitSource = splitSourceGen(false)
const splitSourceFixed = source => (...sinks) => {
  const splitSource = splitSourceGen(true, sinks.length)(source)
  sinks.map(sink => sink(splitSource))
}
const multicast = source => {
  var sinkTalkbacks = []
  var sourceTalkback
  var inProgress = false
  var ended = false
  var started = false
  const talkToSource = (sinkIndex) => (type, data) => {
    if (type === typeEnd) {
      sinkTalkbacks[sinkIndex] = undefined
    }
    else {
      return () => sourceTalkback(type, data)
    }
  }
  const talkToSinks = (type, data) => {
    if (type === typeStart) {
      started = true
      sourceTalkback = data
      return () => sinkTalkbacks.map((talkback, index) => talkback ? () => talkback(type, talkToSource(index)) : undefined)
    }
    else if (type === typeEnd) {
      ended = true
    }
    return () => sinkTalkbacks.map(talkback => talkback ? () => talkback(type, data) : undefined)
  }
  // the protocol isn't completely symmetric so we can't use mergeSources (we need to define an ordering)
  return (type, data) => {
    var mySinkIndex
    if (type === typeStart) {
      mySinkIndex = sinkTalkbacks.push(data)-1
      if (inProgress === false) {
        inProgress = true
        return () => source(typeStart, talkToSinks)
      }
      else if (ended === true) {
        var terminatedBySink = false
        return [() => sinkTalkbacks[mySinkIndex](typeStart, (type, data)=>{if(type === typeEnd){terminatedBySink = true}}), () => terminatedBySink ? undefined : sinkTalkbacks[mySinkIndex](typeEnd)]
      }
      else if (started === true) {
        return () => sinkTalkbacks[mySinkIndex](typeStart, talkToSource(mySinkIndex))
      }
    }
  }
}
const latestGen = replyDataImmediately => source => {
  var received = false
  var latestData = undefined
  // we can return to sink immediately, but we might need to buffer if we do so.
  return (type, data) => {
    if (type === typeStart) {
      var sinkTalkback = data
      var sourceTalkback
      var terminatedBySink = false
      return () => source(typeStart, (type, data) => {
        if (type === typeStart) {
          sourceTalkback = data
          return () => sinkTalkback(typeStart, (type, data) => {
            if (type === typeData && (replyDataImmediately === true || received === true)) {
              return [() => sinkTalkback(typeData, latestData), () => terminatedBySink ? undefined : sourceTalkback(type, data)]
            }
            else if (type === typeEnd) {
              terminatedBySink = true
              return () => sourceTalkback(type, data)
            }
            return () => sourceTalkback(type, data)
          })
        }
        else if (type === typeData) {
          received = true
          latestData = data
          return () => sinkTalkback(typeData, data)
        }
        else {
          return () => sinkTalkback(type, data)
        }
      })
    }
  }
}
const latest = latestGen(false)
const latestRDI = latestGen(true)
const latestEvergreenGen = replyDataImmediately => source => (type, data) => {
  if (type === typeStart) {
    var sinkTalkback = data
    var sourceTalkback
    var received = false
    var latestData = undefined
    var terminatedBySink = false
    return () => source(typeStart, (type, data) => {
      if (type === typeStart) {
        sourceTalkback = data
        return () => sinkTalkback(typeStart, (type, data) => {
          if (type === typeData && (replyDataImmediately === true || received === true)) {
            return [() => sinkTalkback(typeData, latestData), () => terminatedBySink ? undefined : sourceTalkback(type, data)]
          }
          else if (type === typeEnd) {
            terminatedBySink = true
            return () => sourceTalkback(type, data)
          }
          return () => sourceTalkback(type, data)
        })
      }
      else if (type === typeData) {
        received = true
        latestData = data
        return () => sinkTalkback(typeData, data)
      }
      else {
        return () => sinkTalkback(type, data)
      }
    })
  }
}
const latestEvergreen = latestEvergreenGen(false)
const latestEvergreenRDI = latestEvergreenGen(true)
const evergreenSourceGen = (buffered, adsBuffered) => source => (type, data) => {
  if (type === typeStart) {
    var sinkTalkback
    var sourceTalkback
    var started = false
    var buffer = []
    var prevReq
    const sourceReceiver = (type, data) => {
      if (type === typeStart) {
        sourceTalkback = data
        if (started === false) {
          started = true
          return () => sinkTalkback(typeStart, (type, data) => {
            if (sourceTalkback) {
              const savedSourceTalkback = sourceTalkback
              if (type === typeEnd) {
                sourceTalkback = undefined
                // cancel all pending buffered requests (there may still be buffered requests!)
              }
              else if (buffered) {
                // save the previous request. save it to ads buffered if ads is buffered (at a slight performance cost)
                if (type === typeData) {
                  prevReq = () => sourceTalkback(type, data)
                }
                else if (adsBuffered) {
                  buffer.push(() => sourceTalkback(type, data))
                }
              }
              return () => savedSourceTalkback(type, data)
            }
            else if (buffered) {
              // save buffering if buffering not enabled
              buffer.push(() => sourceTalkback ? sourceTalkback(type, data) : undefined)
              // array operations can be expensive, so we use prevReq whenever we can
            }
          })
        }
        else if (buffered) {
          if (buffer.length > 0) {
            if (prevReq !== undefined) {
              buffer.unshift(prevReq)
            }
            const returnBuffer = buffer
            buffer = []
            return returnBuffer
          }
          else {
            // don't return an array if possible because it can be expensive
            // we don't set prevReq to undefined here because we still need it to succeed (instafails will be retried instantly every time)
            return prevReq
          }
        }
      }
      else if (type === typeData) {
        prevReq = undefined
        if (adsBuffered && buffer.length > 0) {
          buffer = []
        }
        // the previous request went through.
        return () => sinkTalkback(typeData, data)
      }
      else if (type === typeEnd) {
        sourceTalkback = undefined
        return () => source(typeStart, sourceReceiver)
      }
      else {
        // receiving an alternate stream message does not mean that the previous request went through.
        return () => sinkTalkback(type, data)
      }
    }
    sinkTalkback = data
    return () => source(typeStart, sourceReceiver)
  }
}
const evergreenSource = evergreenSourceGen(false)
const evergreenSourceBuffered = evergreenSourceGen(true)
const evergreenSourceADSBuffered = evergreenSourceGen(true, true) // camelCase dictates that we capitalize ADS. if a term begins with ADS then we must lowercase it.
const feldFromFactory = funcFactory => {
  // feld stands for "for each fold"
  const felder = () => {
    // necessary for repeatability.
    var func
    var value
    var run = false
    return v => {
      if (run === false) {
        func = funcFactory()
        run = true
      }
      return func(v)
    }
  }
  return mapFromFactories(felder)
}
const tap = func => {
  return feldFromFactory(() => v => (func(v),v))
}
const fold = func => {
  return feldFromFactory(() => {
    var value
    var run = false
    return v => {
      if (run === false) {
        run = true
        value = v
      }
      else {
        value = func(value, v)
      }
      return value
    }
  })
}
const streamCounter = feldFromFactory(() => {
  var count = 0
  return x => ({value: x, count: ++count})
})
const nestedSource = (source) => pipe(
  range(1,0),
  feldFromFactory(() => () => source)
)
const multiListenFactory = () => {
  var sourceTalkbacks = []
  var sinkTalkback
  var buffer = []
  const source = (type, data) => {
    if (type === typeStart) {
      const talkToSources = (type, data) => {
        if (type === typeEnd) {
          buffer = undefined
          return sourceTalkbacks.map((sourceTalkback, sourceTalkbackIndex) => () => sourceTalkbacks[sourceTalkbackIndex] === undefined ? undefined : sourceTalkback(typeEnd))
        }
      }
      sinkTalkback = data
      return buffer.length === 0 ? () => sinkTalkback(typeStart, talkToSources) : [() => sinkTalkback(typeStart, talkToSources), buffer]
    }
  }
  const sinkGen = buffered => source => {
    var mySourceIndex
    trampoline(source(typeStart, (type, data) => {
      if (type === typeStart) {
        retObj.sinkGuarded = sinkGen(false)
        mySourceIndex = sourceTalkbacks.push(data)-1
      }
      if (buffer === undefined) { // this is not a typo. we send end to newly subscribed sources immediately if we have been terminated by our sink.
        return () => sourceTalkbacks[mySourceIndex](typeEnd)
      }
      else if (type === typeData) {
        if (sinkTalkback === undefined) { // buffer is guaranteed to not be undefined here.
          buffered ? buffer.push(() => buffer === undefined ? undefined : sinkTalkback(typeData,data)) : undefined
        }
        else {
          return () => sinkTalkback(typeData, data)
        }
      }
      else if (type === typeEnd) {
        sourceTalkbacks[mySourceIndex] = undefined
      }
    }))
  }
  const retObj = {
    source: source,
    sink: sinkGen(true), // the default sink is buffered.
    sinkUnbuffered: sinkGen(false), // for delayed subscriptions.
    sinkGuarded: () => cbtyFailure // for user-controlled starts.
  }
  return retObj
}
const pipe = (...args) => {
  var res = args[0]
  for (var i = 1; i < args.length; i++) {
    res = args[i](res)
  }
  return res
}
const compose = (...args) => source => {
  var res = source
  for (var i = 0; i < args.length; i++) {
    res = args[i](res)
  }
  return res
}
// some explanation is needed here.
// funcNCompose refers to N => f => g => x1 => x2 => ... => xN => f(g(x1)(x2)...(xN))
// funcComposeN refers to N => f1 => f2 => ... => fN => x => f1(f2(...(fN(x))))
const funcCompose = x => y => z => x(y(z))
const funcNCompose = n => n <= 1 ? funcCompose : funcCompose(funcCompose)(funcNCompose(n-1))
const funcComposeN = (...args) => {
  return x => {
    var res = x
    for (var i = args.length-1; i>-1; i--) {
      res = args[i](res)
    }
    return res
  }
}
const mExports = {
  typeStart: typeStart,
  typeData: typeData,
  typeEnd: typeEnd,
  typeNFE: typeNFE,
  typeIFE: typeIFE,
  typeMIS: typeMIS,
  cbtySuccess: cbtySuccess,
  cbtyQueued: cbtyQueued,
  cbtyFailure: cbtyFailure,
  trampoline: trampoline, // yes, we export even the trampoline
  forEachGen: forEachGen,
  forEach: forEach,
  listen: listen,
  pullOnce: pullOnce,
  start: start,
  listenStart: listenStart,
  pullStart: pullStart,
  factoryToCallback: factoryToCallback,
  factoryPullCallback, factoryPullCallback,
  toPromiselikeGen: toPromiselikeGen,
  toPromiselike: toPromiselike,
  toPromiselikePull: toPromiselikePull,
  toPromiseGen: toPromiseGen,
  toPromise: toPromise,
  toPromisePull: toPromisePull,
  map: map,
  mapFromFactories: mapFromFactories,
  filter: filter,
  lastN: lastN,
  last: last,
  take: take,
  range: range,
  factoryFromCallback: factoryFromCallback,
  fromArray: fromArray,
  rangeInterval: rangeInterval,
  mergeSources: mergeSources,
  splitSourceGen: splitSourceGen,
  splitSource: splitSource,
  splitSourceFixed: splitSourceFixed,
  multicast: multicast,
  latestGen: latestGen,
  latest: latest,
  latestRDI: latestRDI,
  latestEvergreenGen: latestEvergreenGen,
  latestEvergreen: latestEvergreen,
  latestEvergreenRDI: latestEvergreenRDI,
  evergreenSourceGen: evergreenSourceGen,
  evergreenSource: evergreenSource,
  evergreenSourceBuffered: evergreenSourceBuffered,
  evergreenSourceADSBuffered: evergreenSourceADSBuffered,
  feldFromFactory: feldFromFactory,
  tap: tap,
  fold: fold,
  streamCounter: streamCounter,
  nestedSource: nestedSource,
  pipe: pipe,
  multiListenFactory: multiListenFactory,
  compose: compose,
  funcCompose: funcCompose,
  funcNCompose: funcNCompose,
  funcComposeN: funcComposeN
}
mExports.callbags = mExports // create a circular reference
module.exports = mExports
