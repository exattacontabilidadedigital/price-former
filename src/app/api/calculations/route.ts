import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"
import { saveCalculation, getCalculations, deleteCalculation } from "@/app/actions/calculation-actions"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const calculations = await getCalculations()
    return NextResponse.json(calculations)
  } catch (error) {
    console.error("Error fetching calculations:", error)
    return NextResponse.json(
      { error: "Failed to fetch calculations" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const calculation = await saveCalculation(body)
    
    return NextResponse.json(calculation)
  } catch (error) {
    console.error("Error saving calculation:", error)
    return NextResponse.json(
      { error: "Failed to save calculation" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await deleteCalculation(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting calculation:", error)
    return NextResponse.json(
      { error: "Failed to delete calculation" },
      { status: 500 }
    )
  }
}