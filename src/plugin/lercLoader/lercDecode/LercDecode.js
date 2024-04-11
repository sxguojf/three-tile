/*! Lerc 4.0
Copyright 2015 - 2023 Esri
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
A local copy of the license and additional notices are located with the
source distribution at:
http://github.com/Esri/lerc/
Contributors:  Thomas Maurer, Wenxue Ju
*/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Lerc = {}));
})(this, (function (exports) { 'use strict';

  var Module = (() => {
    var _scriptDir = (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('LercDecode.js', document.baseURI).href));
    
    return (
  function(Module) {
    Module = Module || {};

  var Module=typeof Module!="undefined"?Module:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject;});var moduleOverrides=Object.assign({},Module);var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof importScripts=="function";var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary;var fs;var nodePath;var requireNodeFS;if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=require("path").dirname(scriptDirectory)+"/";}else {scriptDirectory=__dirname+"/";}requireNodeFS=()=>{if(!nodePath){fs=require("fs");nodePath=require("path");}};read_=function shell_read(filename,binary){requireNodeFS();filename=nodePath["normalize"](filename);return fs.readFileSync(filename,binary?undefined:"utf8")};readBinary=filename=>{var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret);}return ret};readAsync=(filename,onload,onerror)=>{requireNodeFS();filename=nodePath["normalize"](filename);fs.readFile(filename,function(err,data){if(err)onerror(err);else onload(data.buffer);});};if(process["argv"].length>1){process["argv"][1].replace(/\\/g,"/");}process["argv"].slice(2);process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",function(reason){throw reason});Module["inspect"]=function(){return "[Emscripten Module object]"};}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href;}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src;}if(_scriptDir){scriptDirectory=_scriptDir;}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1);}else {scriptDirectory="";}{read_=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)};}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror();};xhr.onerror=onerror;xhr.send(null);};}}else;Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"]);if(Module["thisProgram"]);if(Module["quit"]);var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];Module["noExitRuntime"]||true;if(typeof WebAssembly!="object"){abort("no native wasm support detected");}var wasmMemory;var ABORT=false;var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heapOrArray,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}else {var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2;}else {u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63;}if(u0<65536){str+=String.fromCharCode(u0);}else {var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023);}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}var buffer,HEAP8,HEAPU8,HEAP32,HEAPU32;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=new Float32Array(buf);Module["HEAPF64"]=new Float64Array(buf);}Module["INITIAL_MEMORY"]||16777216;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift());}}callRuntimeCallbacks(__ATPRERUN__);}function initRuntime(){callRuntimeCallbacks(__ATINIT__);}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift());}}callRuntimeCallbacks(__ATPOSTRUN__);}function addOnPreRun(cb){__ATPRERUN__.unshift(cb);}function addOnInit(cb){__ATINIT__.unshift(cb);}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb);}var runDependencies=0;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}if(runDependencies==0){if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback();}}}function abort(what){{if(Module["onAbort"]){Module["onAbort"](what);}}what="Aborted("+what+")";err(what);ABORT=true;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}function isFileURI(filename){return filename.startsWith("file://")}var wasmBinaryFile;if(Module["locateFile"]){wasmBinaryFile="lerc-wasm.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile);}}else {wasmBinaryFile=new URL("lerc-wasm.wasm",(typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('LercDecode.js', document.baseURI).href))).toString();}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}else {throw "both async and sync fetching of the wasm failed"}}catch(err){abort(err);}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch=="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw "failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}else {if(readAsync){return new Promise(function(resolve,reject){readAsync(wasmBinaryFile,function(response){resolve(new Uint8Array(response));},reject);})}}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["g"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["m"];addOnInit(Module["asm"]["h"]);removeRunDependency();}addRunDependency();function receiveInstantiationResult(result){receiveInstance(result["instance"]);}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(function(instance){return instance}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason);})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&!ENVIRONMENT_IS_NODE&&typeof fetch=="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else {return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync().catch(readyPromiseReject);return {}}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback(Module);continue}var func=callback.func;if(typeof func=="number"){if(callback.arg===undefined){getWasmTableEntry(func)();}else {getWasmTableEntry(func)(callback.arg);}}else {func(callback.arg===undefined?null:callback.arg);}}}var wasmTableMirror=[];function getWasmTableEntry(funcPtr){var func=wasmTableMirror[funcPtr];if(!func){if(funcPtr>=wasmTableMirror.length)wasmTableMirror.length=funcPtr+1;wasmTableMirror[funcPtr]=func=wasmTable.get(funcPtr);}return func}function ___assert_fail(condition,filename,line,func){abort("Assertion failed: "+UTF8ToString(condition)+", at: "+[filename?UTF8ToString(filename):"unknown filename",line,func?UTF8ToString(func):"unknown function"]);}function ___cxa_allocate_exception(size){return _malloc(size+24)+24}function ExceptionInfo(excPtr){this.excPtr=excPtr;this.ptr=excPtr-24;this.set_type=function(type){HEAPU32[this.ptr+4>>2]=type;};this.get_type=function(){return HEAPU32[this.ptr+4>>2]};this.set_destructor=function(destructor){HEAPU32[this.ptr+8>>2]=destructor;};this.get_destructor=function(){return HEAPU32[this.ptr+8>>2]};this.set_refcount=function(refcount){HEAP32[this.ptr>>2]=refcount;};this.set_caught=function(caught){caught=caught?1:0;HEAP8[this.ptr+12>>0]=caught;};this.get_caught=function(){return HEAP8[this.ptr+12>>0]!=0};this.set_rethrown=function(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+13>>0]=rethrown;};this.get_rethrown=function(){return HEAP8[this.ptr+13>>0]!=0};this.init=function(type,destructor){this.set_adjusted_ptr(0);this.set_type(type);this.set_destructor(destructor);this.set_refcount(0);this.set_caught(false);this.set_rethrown(false);};this.add_ref=function(){var value=HEAP32[this.ptr>>2];HEAP32[this.ptr>>2]=value+1;};this.release_ref=function(){var prev=HEAP32[this.ptr>>2];HEAP32[this.ptr>>2]=prev-1;return prev===1};this.set_adjusted_ptr=function(adjustedPtr){HEAPU32[this.ptr+16>>2]=adjustedPtr;};this.get_adjusted_ptr=function(){return HEAPU32[this.ptr+16>>2]};this.get_exception_ptr=function(){var isPointer=___cxa_is_pointer_type(this.get_type());if(isPointer){return HEAPU32[this.excPtr>>2]}var adjusted=this.get_adjusted_ptr();if(adjusted!==0)return adjusted;return this.excPtr};}function ___cxa_throw(ptr,type,destructor){var info=new ExceptionInfo(ptr);info.init(type,destructor);throw ptr}function _abort(){abort("");}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num);}function getHeapMax(){return 2147483648}function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}let alignUp=(x,multiple)=>x+(multiple-x%multiple)%multiple;for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}var asmLibraryArg={"a":___assert_fail,"c":___cxa_allocate_exception,"b":___cxa_throw,"d":_abort,"f":_emscripten_memcpy_big,"e":_emscripten_resize_heap};createWasm();Module["___wasm_call_ctors"]=function(){return (Module["___wasm_call_ctors"]=Module["asm"]["h"]).apply(null,arguments)};Module["_lerc_getBlobInfo"]=function(){return (Module["_lerc_getBlobInfo"]=Module["asm"]["i"]).apply(null,arguments)};Module["_lerc_getDataRanges"]=function(){return (Module["_lerc_getDataRanges"]=Module["asm"]["j"]).apply(null,arguments)};Module["_lerc_decode"]=function(){return (Module["_lerc_decode"]=Module["asm"]["k"]).apply(null,arguments)};Module["_lerc_decode_4D"]=function(){return (Module["_lerc_decode_4D"]=Module["asm"]["l"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return (_malloc=Module["_malloc"]=Module["asm"]["n"]).apply(null,arguments)};Module["_free"]=function(){return (Module["_free"]=Module["asm"]["o"]).apply(null,arguments)};var ___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=function(){return (___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=Module["asm"]["p"]).apply(null,arguments)};var calledRun;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status;}dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller;};function run(args){if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun();}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("");},1);doRun();},1);}else {doRun();}}Module["run"]=run;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()();}}run();


    return Module.ready
  }
  );
  })();

  const pixelTypeInfoMap = [
      {
          pixelType: "S8",
          size: 1,
          ctor: Int8Array,
          range: [-128, 128]
      },
      {
          pixelType: "U8",
          size: 1,
          ctor: Uint8Array,
          range: [0, 255]
      },
      {
          pixelType: "S16",
          size: 2,
          ctor: Int16Array,
          range: [-32768, 32767]
      },
      {
          pixelType: "U16",
          size: 2,
          ctor: Uint16Array,
          range: [0, 65536]
      },
      {
          pixelType: "S32",
          size: 4,
          ctor: Int32Array,
          range: [-2147483648, 2147483647]
      },
      {
          pixelType: "U32",
          size: 4,
          ctor: Uint32Array,
          range: [0, 4294967296]
      },
      {
          pixelType: "F32",
          size: 4,
          ctor: Float32Array,
          range: [-3.4027999387901484e38, 3.4027999387901484e38]
      },
      {
          pixelType: "F64",
          size: 8,
          ctor: Float64Array,
          range: [-1.7976931348623157e308, 1.7976931348623157e308]
      }
  ];
  let loadPromise = null;
  let loaded = false;
  function load(options = {}) {
      if (loadPromise) {
          return loadPromise;
      }
      const locateFile = options.locateFile || ((wasmFileName, scriptDir) => `${scriptDir}${wasmFileName}`);
      loadPromise = Module({ locateFile }).then((lercFactory) => lercFactory.ready.then(() => {
          initLercLib(lercFactory);
          loaded = true;
      }));
      return loadPromise;
  }
  function isLoaded() {
      return loaded;
  }
  const lercLib = {
      getBlobInfo: null,
      decode: null
  };
  function normalizeByteLength(n) {
      // extra buffer on top of 8 byte boundary: https://stackoverflow.com/questions/56019003/why-malloc-in-webassembly-requires-4x-the-memory
      return ((n >> 3) << 3) + 16;
  }
  function copyBytesFromWasm(wasmHeapU8, ptr_data, data) {
      data.set(wasmHeapU8.slice(ptr_data, ptr_data + data.length));
  }
  function initLercLib(lercFactory) {
      const { _malloc, _free, _lerc_getBlobInfo, _lerc_getDataRanges, _lerc_decode_4D, asm } = lercFactory;
      // do not use HeapU8 as memory dynamically grows from the initial 16MB
      // test case: landsat_6band_8bit.24
      let heapU8;
      const memory = Object.values(asm).find((val) => val && "buffer" in val && val.buffer === lercFactory.HEAPU8.buffer);
      // avoid pointer for detached memory, malloc once:
      const mallocMultiple = (byteLengths) => {
          const lens = byteLengths.map((len) => normalizeByteLength(len));
          const byteLength = lens.reduce((a, b) => a + b);
          const ret = _malloc(byteLength);
          heapU8 = new Uint8Array(memory.buffer);
          let prev = lens[0];
          lens[0] = ret;
          // pointers for each allocated block
          for (let i = 1; i < lens.length; i++) {
              const next = lens[i];
              lens[i] = lens[i - 1] + prev;
              prev = next;
          }
          return lens;
      };
      lercLib.getBlobInfo = (blob) => {
          // copy data to wasm. info: Uint32, range: F64
          const infoArrSize = 12;
          const rangeArrSize = 3;
          const infoArr = new Uint8Array(infoArrSize * 4);
          const rangeArr = new Uint8Array(rangeArrSize * 8);
          const [ptr, ptr_info, ptr_range] = mallocMultiple([blob.length, infoArr.length, rangeArr.length]);
          heapU8.set(blob, ptr);
          heapU8.set(infoArr, ptr_info);
          heapU8.set(rangeArr, ptr_range);
          // decode
          let hr = _lerc_getBlobInfo(ptr, blob.length, ptr_info, ptr_range, infoArrSize, rangeArrSize);
          if (hr) {
              _free(ptr);
              throw `lerc-getBlobInfo: error code is ${hr}`;
          }
          heapU8 = new Uint8Array(memory.buffer);
          copyBytesFromWasm(heapU8, ptr_info, infoArr);
          copyBytesFromWasm(heapU8, ptr_range, rangeArr);
          const lercInfoArr = new Uint32Array(infoArr.buffer);
          const statsArr = new Float64Array(rangeArr.buffer);
          // skip ndepth
          const [version, dataType, dimCount, width, height, bandCount, validPixelCount, blobSize, maskCount, depthCount, bandCountWithNoData] = lercInfoArr;
          const headerInfo = {
              version,
              dimCount,
              width,
              height,
              validPixelCount,
              bandCount,
              blobSize,
              maskCount,
              depthCount,
              dataType,
              minValue: statsArr[0],
              maxValue: statsArr[1],
              maxZerror: statsArr[2],
              statistics: [],
              bandCountWithNoData
          };
          if (bandCountWithNoData) {
              _free(ptr);
              return headerInfo;
          }
          if (depthCount === 1 && bandCount === 1) {
              _free(ptr);
              headerInfo.statistics.push({
                  minValue: statsArr[0],
                  maxValue: statsArr[1]
              });
              return headerInfo;
          }
          // get data ranges for nband / ndim blob
          // to reuse blob ptr we need to handle dynamic memory allocation
          const numStatsBytes = depthCount * bandCount * 8;
          const bandStatsMinArr = new Uint8Array(numStatsBytes);
          const bandStatsMaxArr = new Uint8Array(numStatsBytes);
          let ptr_blob = ptr, ptr_min = 0, ptr_max = 0, blob_freed = false;
          if (heapU8.byteLength < ptr + numStatsBytes * 2) {
              _free(ptr);
              blob_freed = true;
              [ptr_blob, ptr_min, ptr_max] = mallocMultiple([blob.length, numStatsBytes, numStatsBytes]);
              heapU8.set(blob, ptr_blob);
          }
          else {
              [ptr_min, ptr_max] = mallocMultiple([numStatsBytes, numStatsBytes]);
          }
          heapU8.set(bandStatsMinArr, ptr_min);
          heapU8.set(bandStatsMaxArr, ptr_max);
          hr = _lerc_getDataRanges(ptr_blob, blob.length, depthCount, bandCount, ptr_min, ptr_max);
          if (hr) {
              _free(ptr_blob);
              if (!blob_freed) {
                  // we have two pointers in two wasm function calls
                  _free(ptr_min);
              }
              throw `lerc-getDataRanges: error code is ${hr}`;
          }
          heapU8 = new Uint8Array(memory.buffer);
          copyBytesFromWasm(heapU8, ptr_min, bandStatsMinArr);
          copyBytesFromWasm(heapU8, ptr_max, bandStatsMaxArr);
          const allMinValues = new Float64Array(bandStatsMinArr.buffer);
          const allMaxValues = new Float64Array(bandStatsMaxArr.buffer);
          const statistics = headerInfo.statistics;
          for (let i = 0; i < bandCount; i++) {
              if (depthCount > 1) {
                  const minValues = allMinValues.slice(i * depthCount, (i + 1) * depthCount);
                  const maxValues = allMaxValues.slice(i * depthCount, (i + 1) * depthCount);
                  const minValue = Math.min.apply(null, minValues);
                  const maxValue = Math.max.apply(null, maxValues);
                  statistics.push({
                      minValue,
                      maxValue,
                      dimStats: { minValues, maxValues },
                      depthStats: { minValues, maxValues }
                  });
              }
              else {
                  statistics.push({
                      minValue: allMinValues[i],
                      maxValue: allMaxValues[i]
                  });
              }
          }
          _free(ptr_blob);
          if (!blob_freed) {
              // we have two pointers in two wasm function calls
              _free(ptr_min);
          }
          return headerInfo;
      };
      lercLib.decode = (blob, blobInfo) => {
          const { maskCount, depthCount, bandCount, width, height, dataType, bandCountWithNoData } = blobInfo;
          // if the heap is increased dynamically between raw data, mask, and data, the malloc pointer is invalid as it will raise error when accessing mask:
          // Cannot perform %TypedArray%.prototype.slice on a detached ArrayBuffer
          const pixelTypeInfo = pixelTypeInfoMap[dataType];
          const numPixels = width * height;
          const maskData = new Uint8Array(numPixels * bandCount);
          const numDataBytes = numPixels * depthCount * bandCount * pixelTypeInfo.size;
          const data = new Uint8Array(numDataBytes);
          const useNoDataArr = new Uint8Array(bandCount);
          const noDataArr = new Uint8Array(bandCount * 8);
          const [ptr, ptr_mask, ptr_data, ptr_useNoData, ptr_noData] = mallocMultiple([
              blob.length,
              maskData.length,
              data.length,
              useNoDataArr.length,
              noDataArr.length
          ]);
          heapU8.set(blob, ptr);
          heapU8.set(maskData, ptr_mask);
          heapU8.set(data, ptr_data);
          heapU8.set(useNoDataArr, ptr_useNoData);
          heapU8.set(noDataArr, ptr_noData);
          const hr = _lerc_decode_4D(ptr, blob.length, maskCount, ptr_mask, depthCount, width, height, bandCount, dataType, ptr_data, ptr_useNoData, ptr_noData);
          if (hr) {
              _free(ptr);
              throw `lerc-decode: error code is ${hr}`;
          }
          heapU8 = new Uint8Array(memory.buffer);
          copyBytesFromWasm(heapU8, ptr_data, data);
          copyBytesFromWasm(heapU8, ptr_mask, maskData);
          let noDataValues = null;
          if (bandCountWithNoData) {
              copyBytesFromWasm(heapU8, ptr_useNoData, useNoDataArr);
              copyBytesFromWasm(heapU8, ptr_noData, noDataArr);
              noDataValues = [];
              const noDataArr64 = new Float64Array(noDataArr.buffer);
              for (let i = 0; i < useNoDataArr.length; i++) {
                  noDataValues.push(useNoDataArr[i] ? noDataArr64[i] : null);
              }
          }
          _free(ptr);
          return {
              data,
              maskData,
              noDataValues
          };
      };
  }
  function swapDepthValuesOrder(pixels, numPixels, depthCount, OutPixelTypeArray, inputIsBIP) {
      if (depthCount < 2) {
          return pixels;
      }
      const swap = new OutPixelTypeArray(numPixels * depthCount);
      if (inputIsBIP) {
          for (let i = 0, j = 0; i < numPixels; i++) {
              for (let iDim = 0, temp = i; iDim < depthCount; iDim++, temp += numPixels) {
                  swap[temp] = pixels[j++];
              }
          }
      }
      else {
          for (let i = 0, j = 0; i < numPixels; i++) {
              for (let iDim = 0, temp = i; iDim < depthCount; iDim++, temp += numPixels) {
                  swap[j++] = pixels[temp];
              }
          }
      }
      return swap;
  }
  /**
   * Decoding a LERC1/LERC2 byte stream and return an object containing the pixel data.
   *
   * @alias module:Lerc
   * @param {ArrayBuffer | Uint8Array} input The LERC input byte stream
   * @param {object} [options] The decoding options below are optional.
   * @param {number} [options.inputOffset] The number of bytes to skip in the input byte stream. A valid Lerc file is expected at that position.
   * @param {number} [options.noDataValue] It is recommended to use the returned mask instead of setting this value.
   * @param {boolean} [options.returnInterleaved] (ndepth LERC2 only) If true, returned depth values are pixel-interleaved, a.k.a [p1_dep1, p1_dep2, ..., p1_depN, p2_dep1...], default is [p1_dep1, p2_dep1, ..., p1_dep2, p2_dep2...]
   * @returns {{width, height, pixels, pixelType, mask, statistics}}
   * @property {number} width Width of decoded image.
   * @property {number} height Height of decoded image.
   * @property {number} depthCount Depth count.
   * @property {array} pixels [band1, band2, …] Each band is a typed array of width*height*depthCount.
   * @property {string} pixelType The type of pixels represented in the output: U8/S8/S16/U16/S32/U32/F32.
   * @property {mask} mask Typed array with a size of width*height, or null if all pixels are valid.
   * @property {array} statistics [statistics_band1, statistics_band2, …] Each element is a statistics object representing min and max values
   * @property {array} [bandMasks] [band1_mask, band2_mask, …] Each band is a Uint8Array of width * height * depthCount.
   **/
  function decode(input, options = {}) {
      var _a, _b;
      // get blob info
      const inputOffset = (_a = options.inputOffset) !== null && _a !== void 0 ? _a : 0;
      const blob = input instanceof Uint8Array ? input.subarray(inputOffset) : new Uint8Array(input, inputOffset);
      const blobInfo = lercLib.getBlobInfo(blob);
      // decode
      const { data, maskData } = lercLib.decode(blob, blobInfo);
      const { width, height, bandCount, dimCount, depthCount, dataType, maskCount, statistics } = blobInfo;
      // get pixels, per-band masks, and statistics
      const pixelTypeInfo = pixelTypeInfoMap[dataType];
      const data1 = new pixelTypeInfo.ctor(data.buffer);
      const pixels = [];
      const masks = [];
      const numPixels = width * height;
      const numElementsPerBand = numPixels * depthCount;
      // options.returnPixelInterleavedDims will be removed in next release
      const swap = (_b = options.returnInterleaved) !== null && _b !== void 0 ? _b : options.returnPixelInterleavedDims;
      for (let i = 0; i < bandCount; i++) {
          const band = data1.subarray(i * numElementsPerBand, (i + 1) * numElementsPerBand);
          if (swap) {
              pixels.push(band);
          }
          else {
              const bsq = swapDepthValuesOrder(band, numPixels, depthCount, pixelTypeInfo.ctor, true);
              pixels.push(bsq);
          }
          masks.push(maskData.subarray(i * numElementsPerBand, (i + 1) * numElementsPerBand));
      }
      // get unified mask
      const mask = maskCount === 0 ? null : maskCount === 1 ? masks[0] : new Uint8Array(numPixels);
      if (maskCount > 1) {
          mask.set(masks[0]);
          for (let i = 1; i < masks.length; i++) {
              const bandMask = masks[i];
              for (let j = 0; j < numPixels; j++) {
                  mask[j] = mask[j] & bandMask[j];
              }
          }
      }
      // apply no data value
      const { noDataValue } = options;
      const applyNoDataValue = noDataValue != null && pixelTypeInfo.range[0] <= noDataValue && pixelTypeInfo.range[1] >= noDataValue;
      if (maskCount > 0 && applyNoDataValue) {
          for (let i = 0; i < bandCount; i++) {
              const band = pixels[i];
              const bandMask = masks[i] || mask;
              for (let j = 0; j < numPixels; j++) {
                  if (bandMask[j] === 0) {
                      band[j] = noDataValue;
                  }
              }
          }
      }
      // only keep band masks when there's per-band unique mask
      const bandMasks = maskCount === bandCount && bandCount > 1 ? masks : null;
      const { pixelType } = pixelTypeInfo;
      return {
          width,
          height,
          pixelType,
          statistics,
          pixels,
          mask,
          dimCount,
          depthCount,
          bandMasks
      };
  }
  /**
   * Get the header information of a LERC1/LERC2 byte stream.
   *
   * @alias module:Lerc
   * @param {ArrayBuffer | Uint8Array} input The LERC input byte stream
   * @param {object} [options] The decoding options below are optional.
   * @param {number} [options.inputOffset] The number of bytes to skip in the input byte stream. A valid Lerc file is expected at that position.
   * @returns {{version, width, height, bandCount, dimCount, validPixelCount, blobSize, dataType, mask, minValue, maxValue, maxZerror, statistics}}
   * @property {number} version Compression algorithm version.
   * @property {number} width Width of decoded image.
   * @property {number} height Height of decoded image.
   * @property {number} bandCount Number of bands.
   * @property {number} depthCount Depth count.
   * @property {number} validPixelCount Number of valid pixels.
   * @property {number} blobSize Lerc blob size in bytes.
   * @property {number} dataType Data type represented in number.
   * @property {number} minValue Minimum pixel value.
   * @property {number} maxValue Maximum pixel value.
   * @property {number} maxZerror Maximum Z error.
   * @property {array} statistics [statistics_band1, statistics_band2, …] Each element is a statistics object representing min and max values
   **/
  function getBlobInfo(input, options = {}) {
      var _a;
      const inputOffset = (_a = options.inputOffset) !== null && _a !== void 0 ? _a : 0;
      const blob = input instanceof Uint8Array ? input.subarray(inputOffset) : new Uint8Array(input, inputOffset);
      return lercLib.getBlobInfo(blob);
  }
  function getBandCount(input, options = {}) {
      // this was available in the old JS version but not documented. Keep as is for backward compatibility.
      const info = getBlobInfo(input, options);
      return info.bandCount;
  }

  exports.decode = decode;
  exports.getBandCount = getBandCount;
  exports.getBlobInfo = getBlobInfo;
  exports.isLoaded = isLoaded;
  exports.load = load;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
