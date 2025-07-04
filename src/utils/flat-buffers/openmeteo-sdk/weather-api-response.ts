// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import * as flatbuffers from 'flatbuffers';

import { Model } from '../openmeteo-sdk/model.js';
import { VariablesWithTime } from '../openmeteo-sdk/variables-with-time.js';


export class WeatherApiResponse {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):WeatherApiResponse {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsWeatherApiResponse(bb:flatbuffers.ByteBuffer, obj?:WeatherApiResponse):WeatherApiResponse {
  return (obj || new WeatherApiResponse()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsWeatherApiResponse(bb:flatbuffers.ByteBuffer, obj?:WeatherApiResponse):WeatherApiResponse {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new WeatherApiResponse()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

latitude():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readFloat32(this.bb_pos + offset) : 0.0;
}

longitude():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readFloat32(this.bb_pos + offset) : 0.0;
}

elevation():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.readFloat32(this.bb_pos + offset) : 0.0;
}

generationTimeMilliseconds():number {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.readFloat32(this.bb_pos + offset) : 0.0;
}

locationId():bigint {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.readInt64(this.bb_pos + offset) : BigInt('0');
}

model():Model {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? this.bb!.readUint8(this.bb_pos + offset) : Model.undefined;
}

utcOffsetSeconds():number {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? this.bb!.readInt32(this.bb_pos + offset) : 0;
}

timezone():string|null
timezone(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
timezone(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

timezoneAbbreviation():string|null
timezoneAbbreviation(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
timezoneAbbreviation(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

current(obj?:VariablesWithTime):VariablesWithTime|null {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? (obj || new VariablesWithTime()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

daily(obj?:VariablesWithTime):VariablesWithTime|null {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? (obj || new VariablesWithTime()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

hourly(obj?:VariablesWithTime):VariablesWithTime|null {
  const offset = this.bb!.__offset(this.bb_pos, 26);
  return offset ? (obj || new VariablesWithTime()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

minutely15(obj?:VariablesWithTime):VariablesWithTime|null {
  const offset = this.bb!.__offset(this.bb_pos, 28);
  return offset ? (obj || new VariablesWithTime()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

sixHourly(obj?:VariablesWithTime):VariablesWithTime|null {
  const offset = this.bb!.__offset(this.bb_pos, 30);
  return offset ? (obj || new VariablesWithTime()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

static startWeatherApiResponse(builder:flatbuffers.Builder) {
  builder.startObject(14);
}

static addLatitude(builder:flatbuffers.Builder, latitude:number) {
  builder.addFieldFloat32(0, latitude, 0.0);
}

static addLongitude(builder:flatbuffers.Builder, longitude:number) {
  builder.addFieldFloat32(1, longitude, 0.0);
}

static addElevation(builder:flatbuffers.Builder, elevation:number) {
  builder.addFieldFloat32(2, elevation, 0.0);
}

static addGenerationTimeMilliseconds(builder:flatbuffers.Builder, generationTimeMilliseconds:number) {
  builder.addFieldFloat32(3, generationTimeMilliseconds, 0.0);
}

static addLocationId(builder:flatbuffers.Builder, locationId:bigint) {
  builder.addFieldInt64(4, locationId, BigInt('0'));
}

static addModel(builder:flatbuffers.Builder, model:Model) {
  builder.addFieldInt8(5, model, Model.undefined);
}

static addUtcOffsetSeconds(builder:flatbuffers.Builder, utcOffsetSeconds:number) {
  builder.addFieldInt32(6, utcOffsetSeconds, 0);
}

static addTimezone(builder:flatbuffers.Builder, timezoneOffset:flatbuffers.Offset) {
  builder.addFieldOffset(7, timezoneOffset, 0);
}

static addTimezoneAbbreviation(builder:flatbuffers.Builder, timezoneAbbreviationOffset:flatbuffers.Offset) {
  builder.addFieldOffset(8, timezoneAbbreviationOffset, 0);
}

static addCurrent(builder:flatbuffers.Builder, currentOffset:flatbuffers.Offset) {
  builder.addFieldOffset(9, currentOffset, 0);
}

static addDaily(builder:flatbuffers.Builder, dailyOffset:flatbuffers.Offset) {
  builder.addFieldOffset(10, dailyOffset, 0);
}

static addHourly(builder:flatbuffers.Builder, hourlyOffset:flatbuffers.Offset) {
  builder.addFieldOffset(11, hourlyOffset, 0);
}

static addMinutely15(builder:flatbuffers.Builder, minutely15Offset:flatbuffers.Offset) {
  builder.addFieldOffset(12, minutely15Offset, 0);
}

static addSixHourly(builder:flatbuffers.Builder, sixHourlyOffset:flatbuffers.Offset) {
  builder.addFieldOffset(13, sixHourlyOffset, 0);
}

static endWeatherApiResponse(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static finishWeatherApiResponseBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
}

static finishSizePrefixedWeatherApiResponseBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset, undefined, true);
}

}
