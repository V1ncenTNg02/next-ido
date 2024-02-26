// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const users = [
    {
      twitter: '@firstUser',
      etherAddress: '0xUNIQUE_ETHER_ADDRESS',
      twitterAvatar: 'https://pbs.twimg.com/profile_images/1737315010211430400/Qx-y7P1X_normal.png'
    },
    {
      twitter: '@admin',
      etherAddress: '0x777BEeF85E717Ab18e44cd054B1a1E33a4A93b83',
      twitterAvatar: 'https://pbs.twimg.com/profile_images/1328893616211705858/2wobzeVN_normal.jpg'
    },
    {
      twitter: '@investor1',
      etherAddress: '0xe2f3D0b405315934b5a57A212358A8b7ACa2d99A',
      twitterAvatar: 'https://pbs.twimg.com/profile_images/1737315010211430400/Qx-y7P1X_normal.png'
    },
    {
      twitter: '@investor2',
      etherAddress: '0x7466D5F8be6Dec263287101894B3cBC934C049eE',
      twitterAvatar: 'https://pbs.twimg.com/profile_images/1737315010211430400/Qx-y7P1X_normal.png'
    },
    {
      twitter: '@investor3',
      etherAddress: '0xa772730c716C17E991cB88c73b9acfdDC44bc70B',
      twitterAvatar: 'https://pbs.twimg.com/profile_images/1737315010211430400/Qx-y7P1X_normal.png'
    },
    {
      twitter: '@MrItachi_',
      etherAddress: '0xd09F22e077A3FA6bc32a875654F3d949af7cdA3b',
      twitterAvatar: 'https://pbs.twimg.com/profile_images/1666342110747058189/1X1_zulU_normal.jpg'
    },
    {
      twitter: '@MrAnime',
      etherAddress: '0xb6377B3fAD2d57515104447F187329370904AD8a',
      twitterAvatar: 'https://pbs.twimg.com/profile_images/1666342110747058189/1X1_zulU_normal.jpg'
    }
  ]

  await prisma.$transaction(users.map(data => prisma.user.create({ data })))

  const referralCodesData = ['CODENUMO', 'CODENUMT', 'CODENUMH', 'CODENUMF', 'CODENUMI'].map(code => {
    return {
      refCode: code,
      creatorId: 1
    }
  })

  await prisma.$transaction(referralCodesData.map(data => prisma.referralCode.create({ data })))

  const projects = [
    {
      contract: 'FIX',
      poolIndex: 52,
      poolName: 'vercel-whitelist',
      SBKey: '45848bc0-a094-4ae7-9194-9bbca4468527',
      slug: 'axie-infinity',
      projectIcon: 'https://a.storyblok.com/f/264453/201x159/27949bcffb/axie-infinity.png',
      isSuccess: true,
      poolInfo: {
        token0: {
          address: '0x10FBBbA9ce65286d50636f0D31ee390b3f3a4A39',
          symbol: 'MT',
          decimals: 18
        },
        token1: {
          address: '0x0000000000000000000000000000000000000000',
          symbol: 'gETH',
          decimals: 18
        },
        releaseType: '0',
        startAt: '2024-01-16T09:46:00.000Z',
        endAt: '2024-01-16T10:46:00.000Z',
        claimStartAt: null,
        claimEndAt: null
      },
      netId: 5
    },
    {
      contract: 'FIX',
      poolIndex: 53,
      poolName: 'vercel-public',
      SBKey: '45848bc0-a094-4ae7-9194-9bbca4468527',
      slug: 'axie-infinity',
      projectIcon: 'https://a.storyblok.com/f/264453/201x159/27949bcffb/axie-infinity.png',
      isSuccess: true,
      poolInfo: {
        token0: {
          address: '0x10FBBbA9ce65286d50636f0D31ee390b3f3a4A39',
          symbol: 'MT',
          decimals: 18
        },
        token1: {
          address: '0x0000000000000000000000000000000000000000',
          symbol: 'gETH',
          decimals: 18
        },
        releaseType: '0',
        startAt: '2024-01-16T09:50:00.000Z',
        endAt: '2024-01-16T11:00:00.000Z',
        claimStartAt: null,
        claimEndAt: null
      },
      netId: 5
    }
  ]

  await prisma.$transaction(projects.map(data => prisma.project.create({ data })))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
