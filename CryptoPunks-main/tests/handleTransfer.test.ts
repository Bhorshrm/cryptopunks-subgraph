import { Address, BigInt, log, ethereum } from '@graphprotocol/graph-ts'
import { Transfer } from '../generated/cryptopunks/cryptopunks'
import {
	newMockEvent,
	test,
	assert,
	clearStore,
	afterEach,
	describe,
	beforeEach,
} from 'matchstick-as/assembly/index'
import { handleTransfer } from '../src/mapping'
import Utils from './helpers/utils'

describe('handleTransfer', () => {
	beforeEach(() => {
		Utils.seedAccount()
	})
	afterEach(() => {
		clearStore()
	})
	test('handleTransfer', () => {
		log.info('handleTransfer1', [])
		let newTransferEvent = createNewTransferEvent(
			Utils.Bi_ZERO,
			Utils.accountDummyZero,
			Utils.accountDummyOne
		)
		log.info('handleTransfer2', [])

		handleTransfer(newTransferEvent)
		log.info('handleTransfer3', [])

		assert.fieldEquals(
			'Account',
			Utils.id_STRING,
			'id',
			Utils.id_BYTES.toHexString()
		)
		log.info('handleTransfer4', [])

		assert.fieldEquals(
			'Punk',
			Utils.id_STRING,
			'numberOfTransfers',
			Utils.Bi_ONE.toString()
		)
	})
})

export function createNewTransferEvent(
	punkId: BigInt,
	fromAccount: Address,
	toAccount: Address
): Transfer {
	let newTransferEvent = changetype<Transfer>(newMockEvent())

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam('from', ethereum.Value.fromAddress(fromAccount)),
		new ethereum.EventParam('to', ethereum.Value.fromBytes(toAccount)),
		new ethereum.EventParam(
			'punkIndex',
			ethereum.Value.fromUnsignedBigInt(punkId)
		),
	]

	newTransferEvent.parameters = parameters

	return newTransferEvent
}
